const crypto = globalThis.crypto.subtle;

// global hkdf info constant, can be anything
const hkdfInfo = new TextEncoder().encode("Created by Mester");

function toHex(buffer: ArrayBufferLike) {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

function fromHex(hex: string) {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
}

/**
 * Options for initialising a DoubleRatchet instance.
 */
interface InitOptions {
    /**
     * The public key of the remote party.
     */
    pubkey: Uint8Array;
    /**
     * Our next receiving header key.
     */
    NRHK: Uint8Array;
    /**
     * Our sending header key.
     */
    SHK: Uint8Array;
}

/**
 * A little type jugglery to make the return type of DoubleRatchet.build() work.
 */
type DRInit<T extends InitOptions | undefined> = T extends InitOptions
    ? DoubleRatchet
    : { dr: DoubleRatchet; SHK: Uint8Array; NRHK: Uint8Array };

interface RawMessage {
    iv: Uint8Array;
    ciphertext: Uint8Array;
}

interface Header {
    pubkey: Uint8Array;
    N: number;
    PN: number;
}

interface MessageBundle {
    rawMessage: RawMessage;
    header: RawMessage;
}

/**
 * A single symmetric ratchet that can turn and return a message key.
 */
class SymRatchet {
    // set the state to a private member, so it cannot be accessed from outside
    #state: Uint8Array = new Uint8Array();

    constructor(seed: Uint8Array) {
        if (seed.byteLength !== 32) throw new Error("Invalid seed length");
        this.#state = seed;
    }

    async turn() {
        const state = await crypto.importKey("raw", this.#state, "HKDF", false, ["deriveBits"]);

        // create a new state, the salt is just an empty array
        const newState = await crypto.deriveBits({ name: "HKDF", hash: "SHA-512", salt: new Uint8Array(), info: hkdfInfo }, state, 64 * 8);

        // set the state to the first 32 bytes
        this.#state = new Uint8Array(newState, 0, 32);

        // return the last 32 bytes (used for message encryption/decryption)
        return new Uint8Array(newState, 32, 32);
    }
}

/**
 * A Diffie-Hellman ratchet used to provide future secrecy.
 */
class DHRatchet {
    #state: Uint8Array = new Uint8Array();
    #keyChain: CryptoKeyPair | undefined;

    async init(seed: Uint8Array) {
        if (seed.byteLength !== 32) throw new Error("Invalid seed length");
        this.#state = seed;

        // generate a key pair
        this.#keyChain = await crypto.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
    }

    async getPubkey() {
        if (!this.#keyChain) throw new Error("DHRatchet not initialized");

        const k = await crypto.exportKey("raw", this.#keyChain.publicKey);
        return new Uint8Array(k);
    }

    async turn(pubkey: Uint8Array, newKey: boolean = false) {
        if (!this.#keyChain) throw new Error("DHRatchet not initialized");

        // if needed, generate a new key pair
        if (newKey) {
            this.#keyChain = await crypto.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
        }

        // import the public key
        const publicKey = await crypto.importKey("raw", pubkey, { name: "ECDH", namedCurve: "P-256" }, false, []);

        // derive a new DH output
        const dhOutput = await crypto.deriveBits({ name: "ECDH", public: publicKey }, this.#keyChain.privateKey, 32 * 8);

        // use the DH output as the HKDF salt
        // generate 96 bytes of output (32 = new state, 32 = seed for next ratchet, 32 = next header key)
        const state = await crypto.importKey("raw", this.#state, { name: "HKDF" }, false, ["deriveBits"]);
        const newState = await crypto.deriveBits({ name: "HKDF", hash: "SHA-512", salt: dhOutput, info: hkdfInfo }, state, 3 * 32 * 8);

        // set the state to the first 32 bytes and the two outputs to the next 64 bytes
        this.#state = new Uint8Array(newState, 0, 32);
        const o1 = new Uint8Array(newState, 32, 32);
        const o2 = new Uint8Array(newState, 64, 32);

        return { o1, o2 };
    }

    static async build(seed: Uint8Array) {
        const dr = new DHRatchet();
        await dr.init(seed);

        return dr;
    }
}

/**
 * A double ratchet that can encrypt and decrypt messages.
 */
class DoubleRatchet {
    root: DHRatchet;
    #send: SymRatchet | undefined;
    #receive: SymRatchet | undefined;

    /**
     * Remote/receive key
     */
    #RK: string = "";

    /**
     * Message and previous message numbers for send and receive ratchets
     */
    #SN: number = 0;
    #RN: number = 0;
    #SPN: number = 0;
    #RPN: number = 0;

    /**
     * (Next) header keys for sending and receiving
     */
    #SHK: Uint8Array | undefined;
    #NSHK: Uint8Array | undefined;
    #RHK: Uint8Array | undefined;
    #NRHK: Uint8Array | undefined;

    #skippedKeys = new Array<{ headerKey: string; N: number; messageKey: Uint8Array }>();

    constructor() {
        this.root = new DHRatchet();
    }

    async #turn(pubkey: Uint8Array) {
        this.#RK = toHex(pubkey);

        // step 1: turn the root ratchet and use it for the receiving ratchet's seed
        const { o1: receiveSeed, o2: NRHK } = await this.root.turn(pubkey);
        this.#receive = new SymRatchet(receiveSeed);
        this.#RPN = this.#RN;
        this.#RN = 0;
        if (this.#NRHK) this.#RHK = this.#NRHK;
        this.#NRHK = NRHK;

        // step 2: turn the root ratchet again - this time with a new key - and use it for the sending ratchet's seed
        const { o1: sendSeed, o2: NSHK } = await this.root.turn(pubkey, true);
        this.#send = new SymRatchet(sendSeed);
        this.#SPN = this.#SN;
        this.#SN = 0;
        if (this.#NSHK) this.#SHK = this.#NSHK;
        this.#NSHK = NSHK;
    }

    async encrypt(message: Uint8Array): Promise<MessageBundle> {
        if (!this.#send) throw new Error("DoubleRatchet not initialized");

        // generate random IV
        const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));

        // turn the send ratchet to create a message key
        const messageKey = await crypto.importKey("raw", await this.#send.turn(), { name: "AES-GCM" }, false, ["encrypt"]);
        const ciphertext = new Uint8Array(await crypto.encrypt({ name: "AES-GCM", iv }, messageKey, message));

        const header: Header = {
            pubkey: await this.root.getPubkey(),
            N: this.#SN,
            PN: this.#SPN,
        };

        // encrypt the header
        const headerKey = await crypto.importKey("raw", this.#SHK!, { name: "AES-GCM" }, false, ["encrypt"]);
        const headerPlainText = new TextEncoder().encode(
            JSON.stringify({
                pubkey: toHex(header.pubkey),
                N: header.N,
                PN: header.PN,
            })
        );
        const headerIv = globalThis.crypto.getRandomValues(new Uint8Array(12));
        const headerCiphertext = new Uint8Array(await crypto.encrypt({ name: "AES-GCM", iv: headerIv }, headerKey, headerPlainText));

        this.#SN++;

        return { rawMessage: { iv, ciphertext }, header: { iv: headerIv, ciphertext: headerCiphertext } } satisfies MessageBundle;
    }

    async #decrypt(rawMessage: RawMessage, messageKey: CryptoKey) {
        const { iv, ciphertext } = rawMessage;

        // decrypt the message
        return crypto.decrypt({ name: "AES-GCM", iv }, messageKey, ciphertext).then((pt) => new Uint8Array(pt));
    }

    async #decryptHeader(header: RawMessage): Promise<{ header: Header; doTurn: boolean } | null> {
        let headerPlainText: Uint8Array | null = null;
        let doTurn = false;

        // step 1: try the current header key
        try {
            if (!this.#RHK) throw new Error("No RHK");

            const headerKey = await crypto.importKey("raw", this.#RHK, { name: "AES-GCM" }, false, ["decrypt"]);
            headerPlainText = new Uint8Array(await crypto.decrypt({ name: "AES-GCM", iv: header.iv }, headerKey, header.ciphertext));
        } catch (e) {}

        // step 2: try the next header key
        try {
            if (!this.#NRHK) throw new Error("No NRHK");

            const headerKey = await crypto.importKey("raw", this.#NRHK, { name: "AES-GCM" }, false, ["decrypt"]);
            headerPlainText = new Uint8Array(await crypto.decrypt({ name: "AES-GCM", iv: header.iv }, headerKey, header.ciphertext));
            doTurn = true;
        } catch (e) {}

        if (!headerPlainText) return null;

        const headerJson = JSON.parse(new TextDecoder().decode(headerPlainText));

        return {
            header: {
                pubkey: fromHex(headerJson.pubkey),
                N: headerJson.N,
                PN: headerJson.PN,
            },
            doTurn,
        };
    }

    async processMessage(message: MessageBundle) {
        // check if we already have a key for this message
        // unfortunately, this'll be very ugly: we'll linearly search the array for the key that decrypts the header
        // if we manage to decrypt the header, we'll first check if the N values match, and if they do, we'll use the key to decrypt the message
        let foundHeaderKey: CryptoKey | null = null;
        for (const { headerKey, N, messageKey } of this.#skippedKeys) {
            try {
                let key: CryptoKey | null = foundHeaderKey;
                if (!key) key = await crypto.importKey("raw", fromHex(headerKey), { name: "AES-GCM" }, false, ["decrypt"]);
                const headerPlainText = await crypto.decrypt({ name: "AES-GCM", iv: message.header.iv }, key, message.header.ciphertext);

                // at this point, we know the key is correct, let's speed up the search by saving it
                foundHeaderKey = key;

                const headerJson = JSON.parse(new TextDecoder().decode(headerPlainText));

                // check if the N values match
                if (headerJson.N !== N) continue;

                // we found the key, decrypt the message
                const mKey = await crypto.importKey("raw", messageKey, { name: "AES-GCM" }, false, ["decrypt"]);
                return this.#decrypt(message.rawMessage, mKey);
            } catch {
                continue;
            }
        }

        // decrypt the header
        const decryptedHeader = await this.#decryptHeader(message.header);
        if (!decryptedHeader) throw new Error("Invalid/corrupt message");

        const { header, doTurn } = decryptedHeader;

        // calculate the number of skipped messages in the previous ratchet if we're about to do a root turn
        if (doTurn) {
            const skippedPrev = header.PN - this.#RN;
            const offset = this.#RN; // this is needed to correctly calculate the skipped keys

            for (let i = 0; i < skippedPrev; i++) {
                const key = await this.#receive!.turn();
                this.#skippedKeys.push({ headerKey: toHex(this.#RHK!), N: i + offset, messageKey: key });
            }

            await this.#turn(header.pubkey);
        }

        // calculate the number of skipped messages in the current ratchet
        const skipped = doTurn ? header.N : header.N - this.#RN;
        const offset = doTurn ? 0 : this.#RN; // this is needed to correctly calculate the skipped keys

        for (let i = 0; i < skipped; i++) {
            const key = await this.#receive!.turn();
            this.#skippedKeys.push({ headerKey: toHex(this.#RHK!), N: i + offset, messageKey: key });
        }

        // update RN
        this.#RN = header.N + 1;

        // decrypt the message
        const messageKey = await crypto.importKey("raw", await this.#receive!.turn(), { name: "AES-GCM" }, false, ["decrypt"]);
        return this.#decrypt(message.rawMessage, messageKey);
    }

    static async build<T extends InitOptions | undefined>(seed: Uint8Array, init: T) {
        const dr = new DoubleRatchet();
        dr.root = await DHRatchet.build(seed);

        if (init) {
            // initialize the header keys
            dr.#SHK = init.SHK;
            dr.#NRHK = init.NRHK;

            // turn the root ratchet to create the send ratchet and the next receive ratchet
            const { o1: sendSeed, o2: NSHK } = await dr.root.turn(init.pubkey);
            dr.#send = new SymRatchet(sendSeed);
            dr.#NSHK = NSHK;

            return <DRInit<T>>dr;
        }

        // if there are no init options, we're the first party, generate our sending header key and next receiving header key
        dr.#SHK = globalThis.crypto.getRandomValues(new Uint8Array(32));
        dr.#NRHK = globalThis.crypto.getRandomValues(new Uint8Array(32));

        // return the DR session and the header keys for the other party
        return <DRInit<T>>{ dr, SHK: dr.#NRHK, NRHK: dr.#SHK };
    }
}

const seed = globalThis.crypto.getRandomValues(new Uint8Array(32));

const { dr: alice, NRHK, SHK } = await DoubleRatchet.build(seed, undefined);
const bob = await DoubleRatchet.build(seed, { pubkey: await alice.root.getPubkey(), NRHK, SHK });

// Bob sends message 1 and 2 to Alice
const message1 = await bob.encrypt(new TextEncoder().encode("This is message 1!"));
console.log("Bob sends:", message1);
const message2 = await bob.encrypt(new TextEncoder().encode("This is message 2!"));

// message 1 arrives, 2 is delayed
const decrypted1 = await alice.processMessage(message1);
console.log("Alice receives:", new TextDecoder().decode(decrypted1));

// Alice sends message 3
const message3 = await alice.encrypt(new TextEncoder().encode("This is message 3!"));

const decrypted3 = await bob.processMessage(message3);
console.log("Bob receives:", new TextDecoder().decode(decrypted3));

// Bob sends message 4, message 2 also arrives
const message4 = await bob.encrypt(new TextEncoder().encode("This is message 4!"));

const decrypted4 = await alice.processMessage(message4);
console.log("Alice receives:", new TextDecoder().decode(decrypted4));
const decrypted2 = await alice.processMessage(message2);
console.log("Alice receives:", new TextDecoder().decode(decrypted2));

// mark this file as a module
export {};
