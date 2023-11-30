const crypto = globalThis.crypto.subtle;

const password = "flA3_24%xD-!p2aYr";

type KeyType = "authentication" | "masterEnc";
type Key<T extends KeyType> = T extends "authentication" ? string : CryptoKey;

async function generateKey<T extends KeyType>(password: string, type: T): Promise<Key<T>> {
    // read the password and pass it through HKDF
    const rawPassword = new TextEncoder().encode(password);
    const passwordKey = await crypto.importKey("raw", rawPassword, { name: "HKDF" }, false, ["deriveBits"]);

    // salt: empty Uint8Array, info: type
    const bits = await crypto.deriveBits({ name: "HKDF", hash: "SHA-256", salt: new Uint8Array(), info: new TextEncoder().encode(type) }, passwordKey, 256);

    // if it's the authentication key, we need to convert the bytes to a hex string
    // otherwise, return the bytes as an AES key
    if (type === "authentication") {
        return <Key<T>>Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
    } else {
        return <Promise<Key<T>>>crypto.importKey("raw", bits, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
    }
}

console.log("Authentication key:", await generateKey(password, "authentication"));
console.log("Master key encryption:", await generateKey(password, "masterEnc"));

class E2EEClient {
    /**
     * The secret data we have to secure
     */
    #secret: Uint8Array;

    constructor() {
        // initialise the secret with dummy data
        this.#secret = new Uint8Array();
    }

    /**
     * A function to simulate creating a new user
     * @param password The password of the user
     */
    async register(password: string) {
        // generate a random master key
        const masterKey = crypto.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    }
}

export {};