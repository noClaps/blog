const crypto = globalThis.crypto.subtle;

// global hkdf info constant, can be anything
const hkdfInfo = new TextEncoder().encode("Created by Mester");

function toHex(buffer: ArrayBufferLike) {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

interface RawMessage {
    iv: ArrayBufferLike;
    ciphertext: ArrayBufferLike;
}

interface Header {
    pubkey: ArrayBufferLike;
    N: number;
    PN: number;
}

interface MessageBundle {
    rawMessage: RawMessage;
    header: Header;
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

        // create a new state, the salt is just a single 0 byte
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

    getPubkey() {
        if (!this.#keyChain) throw new Error("DHRatchet not initialized");

        return crypto.exportKey("raw", this.#keyChain.publicKey);
    }

    async turn(pubkey: ArrayBuffer, newKey: boolean = false) {
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
        const state = await crypto.importKey("raw", this.#state, { name: "HKDF" }, false, ["deriveBits"]);
        const newState = await crypto.deriveBits({ name: "HKDF", hash: "SHA-512", salt: dhOutput, info: hkdfInfo }, state, 64 * 8);

        // set the state to the first 32 bytes and the final output to the last 32 bytes
        this.#state = new Uint8Array(newState, 0, 32);
        const final = new Uint8Array(newState, 32, 32);

        return final;
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

    #skippedKeys = new Array<{ pubkey: string; N: number; key: ArrayBuffer }>();

    constructor() {
        this.root = new DHRatchet();
    }

    async #turn(pubkey: ArrayBuffer) {
        this.#RK = toHex(pubkey);

        // step 1: turn the root ratchet and use it for the receiving ratchet's seed
        const receiveSeed = await this.root.turn(pubkey);
        this.#receive = new SymRatchet(receiveSeed);
        this.#RPN = this.#RN;
        this.#RN = 0;

        // step 2: turn the root ratchet again - this time with a new key - and use it for the sending ratchet's seed
        const sendSeed = await this.root.turn(pubkey, true);
        this.#send = new SymRatchet(sendSeed);
        this.#SPN = this.#SN;
        this.#SN = 0;
    }

    async encrypt(message: ArrayBuffer): Promise<MessageBundle> {
        if (!this.#send) throw new Error("DoubleRatchet not initialized");

        // generate random IV
        const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));

        // turn the send ratchet to create a message key
        const messageKey = await crypto.importKey("raw", await this.#send.turn(), { name: "AES-GCM" }, false, ["encrypt"]);
        const ciphertext = await crypto.encrypt({ name: "AES-GCM", iv }, messageKey, message);

        const header: Header = {
            pubkey: await this.root.getPubkey(),
            N: this.#SN,
            PN: this.#SPN,
        };

        this.#SN++;

        return { rawMessage: { iv, ciphertext }, header };
    }

    async #decrypt(rawMessage: RawMessage, messageKey: CryptoKey): Promise<ArrayBuffer> {
        const { iv, ciphertext } = rawMessage;

        // decrypt the message
        return crypto.decrypt({ name: "AES-GCM", iv }, messageKey, ciphertext);
    }

    async processMessage(message: MessageBundle) {
        // check if we already have a key for this message
        const skippedKey = this.#skippedKeys.find((k) => k.pubkey === toHex(message.header.pubkey) && k.N === message.header.N);
        if (skippedKey) {
            const messageKey = await crypto.importKey("raw", skippedKey.key, { name: "AES-GCM" }, false, ["decrypt"]);
            this.#skippedKeys.splice(this.#skippedKeys.indexOf(skippedKey), 1); // remove the key from the skipped keys array
            return this.#decrypt(message.rawMessage, messageKey);
        }

        const doTurn = this.#RK !== toHex(message.header.pubkey);

        // calculate the number of skipped messages in the previous ratchet if we're about to do a root turn
        if (doTurn) {
            const skippedPrev = message.header.PN - this.#RN;
            const offset = this.#RN; // this is needed to correctly calculate the skipped keys

            for (let i = 0; i < skippedPrev; i++) {
                const key = await this.#receive!.turn();
                this.#skippedKeys.push({ pubkey: this.#RK, N: i + offset, key });
            }
        }

        // do a turn if needed
        if (doTurn) await this.#turn(message.header.pubkey);

        // calculate the number of skipped messages in the current ratchet
        const skipped = doTurn ? message.header.N : message.header.N - this.#RN;
        const offset = doTurn ? 0 : this.#RN; // this is needed to correctly calculate the skipped keys

        for (let i = 0; i < skipped; i++) {
            const key = await this.#receive!.turn();
            this.#skippedKeys.push({ pubkey: toHex(message.header.pubkey), N: i + offset, key });
        }

        // update RN
        this.#RN = message.header.N + 1;

        // decrypt the message
        const messageKey = await crypto.importKey("raw", await this.#receive!.turn(), { name: "AES-GCM" }, false, ["decrypt"]);
        return this.#decrypt(message.rawMessage, messageKey);
    }

    static async build(seed: Uint8Array, pubkey?: ArrayBuffer) {
        const dr = new DoubleRatchet();
        dr.root = await DHRatchet.build(seed);

        if (pubkey) {
            // a new keychain is not needed, since DHRatchet.build() automatically creates a new key pair
            const dhOutput = await dr.root.turn(pubkey);
            dr.#send = new SymRatchet(dhOutput);
        }

        return dr;
    }
}

const seed = globalThis.crypto.getRandomValues(new Uint8Array(32));

const alice = await DoubleRatchet.build(seed);
const bob = await DoubleRatchet.build(seed, await alice.root.getPubkey());

// Bob sends message 1 and 2 to Alice
const message1 = await bob.encrypt(new TextEncoder().encode("This is message 1!"));
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
