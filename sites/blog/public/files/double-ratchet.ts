const crypto = window.crypto.subtle;

// global hkdf info constant, can be anything
const hkdfInfo = new TextEncoder().encode("Created by Mester");

function toHex(buffer: ArrayBuffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** 
 * A single symmetric ratchet that can turn and return a message key
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
        const newState = await crypto.deriveBits({ name: "HKDF", hash: "SHA-512", salt: new Uint8Array([0]), info: hkdfInfo }, state, 64 * 8);

        // set the state to the first 32 bytes
        this.#state = new Uint8Array(newState, 0, 32);

        // return the last 32 bytes (used for message encryption/decryption)
        return new Uint8Array(newState, 32, 32);
    }
}

/**
 * A Diffie-Hellman ratchet used to provide future secrecy
 */
class DHRatchet {
    #state: Uint8Array = new Uint8Array();
    #keyChain: CryptoKeyPair;

    async init(seed: Uint8Array) {
        if (seed.byteLength !== 32) throw new Error("Invalid seed length");
        this.#state = seed;

        // generate a key pair
        this.#keyChain = await crypto.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
    }

    getPubkey() {
        return crypto.exportKey("raw", this.#keyChain.publicKey);
    }

    async turn(pubkey: ArrayBuffer, newKey: boolean = false) {
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

// utility interfaces
interface RawMessage {
    iv: ArrayBuffer;
    ciphertext: ArrayBuffer;
}

interface Header {
    pubkey: ArrayBuffer;
    N: number;
    PN: number;
}

interface MessageBundle {
    rawMessage: RawMessage;
    header: Header;
}

/**
 * A double ratchet that can encrypt and decrypt messages
 */
class DoubleRatchet {
    root: DHRatchet;
    #send: SymRatchet;
    #receive: SymRatchet;

    /**
     * Remove/receive key
     */
    #RK: string = "";

    /**
     * Message and previous message numbers for send and receive ratchets
     */
    #SN: number = 0;
    #RN: number = 0;
    #SPN: number = 0;
    #RPN: number = 0;

    #skippedKeys = new Array<{ pubkey: string, N: number, key: ArrayBuffer }>();

    constructor() {
        this.root = new DHRatchet();
    }

    async #turn(pubkey: ArrayBuffer) {
        this.#RK = toHex(pubkey);

        // create a receive ratchet
        let dhOutput = await this.root.turn(pubkey);
        this.#receive = new SymRatchet(dhOutput);
        this.#RPN = this.#RN;
        this.#RN = 0;

        // create a send ratchet (always with a new key)
        dhOutput = await this.root.turn(pubkey, true);
        this.#send = new SymRatchet(dhOutput);
        this.#SPN = this.#SN;
        this.#SN = 0;
    }

    async encrypt(message: ArrayBuffer): Promise<MessageBundle> {
        // generate random IV
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        // turn the send ratchet to create a message key
        const messageKey = await crypto.importKey("raw", await this.#send.turn(), { name: "AES-GCM", }, false, ["encrypt"]);
        const ciphertext = await crypto.encrypt({ name: "AES-GCM", iv }, messageKey, message);

        const header: Header = {
            pubkey: await this.root.getPubkey(),
            N: this.#SN,
            PN: this.#SPN,
        }

        this.#SN++;

        return { header, rawMessage: { iv, ciphertext } };
    }

    async #decrypt(rawMessage: RawMessage, messageKey: CryptoKey) {
        const { iv, ciphertext } = rawMessage;

        // decrypt the message
        const message = await crypto.decrypt({ name: "AES-GCM", iv }, messageKey, ciphertext);

        return message;
    }

    async processMessage(message: MessageBundle) {
        // check if we already have a key for this message
        const skippedKey = this.#skippedKeys.find(k => k.pubkey === toHex(message.header.pubkey) && k.N === message.header.N)?.key;
        if (skippedKey) {
            const messageKey = await crypto.importKey("raw", skippedKey, { name: "AES-GCM" }, false, ["decrypt"]);
            this.#skippedKeys.splice(this.#skippedKeys.findIndex(k => toHex(k.key) === toHex(skippedKey)), 1); // remove the key from the skipped keys array
            return this.#decrypt(message.rawMessage, messageKey);
        }

        const doTurn = this.#RK !== toHex(message.header.pubkey);

        // calculate the number of skipped messages in the previous ratchet
        if (doTurn) {
            const skippedPrev = message.header.PN - this.#RN;
            for (let i = 0; i < skippedPrev; i++) {
                const key = await this.#receive.turn();
                this.#skippedKeys.push({ pubkey: toHex(message.header.pubkey), N: i, key });
            }
        }

        // do a turn if needed
        if (doTurn) await this.#turn(message.header.pubkey);

        // calculate the number of skipped messages in the current ratchet
        const skipped = doTurn ? message.header.N : message.header.N - this.#RN;
        const offset = doTurn ? 0 : this.#RN; // this is needed to correctly calculate the skipped keys
        for (let i = 0; i < skipped; i++) {
            const key = await this.#receive.turn();
            this.#skippedKeys.push({ pubkey: toHex(message.header.pubkey), N: i + offset, key });
        }

        // update RN
        this.#RN = message.header.N + 1;

        // decrypt the message
        const messageKey = await crypto.importKey("raw", await this.#receive.turn(), { name: "AES-GCM" }, false, ["decrypt"]);
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

const seed = window.crypto.getRandomValues(new Uint8Array(32));

const alice = await DoubleRatchet.build(seed);
const bob = await DoubleRatchet.build(seed, await alice.root.getPubkey());

// Bob sends a message to Alice
const message1 = await bob.encrypt(new TextEncoder().encode("Hello Alice, this is message 1!"));

// Alice receives the message
const decrypted1 = await alice.processMessage(message1);
console.log("Alice receives:", new TextDecoder().decode(decrypted1));

// Alice sends a message to Bob to trigger a DH ratchet turn
const message2 = await alice.encrypt(new TextEncoder().encode("Hello Bob, this is message 2!"));

// Bob receives the message
const decrypted2 = await bob.processMessage(message2);
console.log("Bob receives:", new TextDecoder().decode(decrypted2));

// Bob sends message 3, 4 and 5
const message3 = await bob.encrypt(new TextEncoder().encode("Hello Alice, this is message 3!"));
const message4 = await bob.encrypt(new TextEncoder().encode("Hello Alice, this is message 4!"));
const message5 = await bob.encrypt(new TextEncoder().encode("Hello Alice, this is message 5!"));

// Messages 3 and 4 are skipped

// Alice receives message 5
const decrypted5 = await alice.processMessage(message5);
console.log("Alice receives:", new TextDecoder().decode(decrypted5));

// Messages 3 and 4 are received
const decrypted3 = await alice.processMessage(message3);
console.log("Alice receives:", new TextDecoder().decode(decrypted3));
const decrypted4 = await alice.processMessage(message4);
console.log("Alice receives:", new TextDecoder().decode(decrypted4));