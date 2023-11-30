const crypto = globalThis.crypto.subtle;

const password = "flA3_24%xD-!p2aYr";

function toHex(buffer: ArrayBufferLike) {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

function fromHex(hex: string) {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
}

type KeyType = "authentication" | "masterEnc";
type Key<T extends KeyType> = T extends "authentication" ? string : CryptoKey;

async function generateKey<T extends KeyType>(password: string, type: T): Promise<Key<T>> {
    // read the password and pass it through HKDF
    const rawPassword = new TextEncoder().encode(password);
    const passwordKey = await crypto.importKey("raw", rawPassword, { name: "HKDF" }, false, ["deriveBits"]);

    // salt: empty Uint8Array, info: type
    const bits = await crypto.deriveBits(
        { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(), info: new TextEncoder().encode(type) },
        passwordKey,
        256
    );

    // if it's the authentication key, we need to convert the bytes to a hex string
    // otherwise, return the bytes as an AES key
    if (type === "authentication") {
        return <Key<T>>Array.from(new Uint8Array(bits))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    } else {
        return <Promise<Key<T>>>crypto.importKey("raw", bits, { name: "AES-GCM" }, false, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]);
    }
}

class Client {
    /**
     * The secret data we have to secure
     */
    #secret: Uint8Array;

    /**
     * The master key of the client
     */
    #masterKey: CryptoKey;

    /**
     * The key used to encrypt the master key
     */
    #masterEnc: CryptoKey;

    constructor(secret: Uint8Array, masterKey: CryptoKey, masterEnc: CryptoKey) {
        this.#secret = secret;
        this.#masterKey = masterKey;
        this.#masterEnc = masterEnc;
    }

    async export() {
        // encrypt the secret with the master key
        const secretIV = globalThis.crypto.getRandomValues(new Uint8Array(12));
        const secretEnc = await crypto.encrypt({ name: "AES-GCM", iv: secretIV }, this.#masterKey, this.#secret);
        const secretCipherText = new Uint8Array(secretEnc.byteLength + secretIV.byteLength);
        secretCipherText.set(new Uint8Array(secretIV), 0);
        secretCipherText.set(new Uint8Array(secretEnc), secretIV.byteLength);

        // encrypt the master key with the master encryption key
        const masterIV = globalThis.crypto.getRandomValues(new Uint8Array(12));
        const masterEnc = await crypto.wrapKey("jwk", this.#masterKey, this.#masterEnc, { name: "AES-GCM", iv: masterIV });
        const masterCipherText = new Uint8Array(masterEnc.byteLength + masterIV.byteLength);
        masterCipherText.set(new Uint8Array(masterIV), 0);
        masterCipherText.set(new Uint8Array(masterEnc), masterIV.byteLength);

        // return the encrypted secret and master key as an object
        return {
            secret: toHex(secretCipherText),
            master: toHex(masterCipherText)
        };
    }

    /**
     * A function to simulate creating a new user
     * @param password The password of the user
     */
    static async register(password: string) {
        // generate a random master key
        const masterKey = await crypto.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);

        // generate a random secret
        const secret = globalThis.crypto.getRandomValues(new Uint8Array(32));

        // generate the encryption key for the master key
        const masterEnc = await generateKey(password, "masterEnc");

        const client = new Client(secret, masterKey, masterEnc);

        // now generate the authentication key
        const authenticationKey = await generateKey(password, "authentication");

        // this is where we would send the authentication key to the server and implement the rest of the registration process
        console.log("Registering user with authentication key:", authenticationKey);

        return client;
    }

    static async login(state: Awaited<ReturnType<Client["export"]>>, password: string) {
        // generate the authentication key
        const authenticationKey = await generateKey(password, "authentication");

        // this is where we would send the authentication key to the server and implement the rest of the login process
        console.log("Logging in user with authentication key:", authenticationKey);

        // decrypt the master key
        const masterEncKey = await generateKey(password, "masterEnc");
        const masterCipherText = fromHex(state.master);
        const masterIV = masterCipherText.slice(0, 12);
        const masterEnc = masterCipherText.slice(12);
        const masterKey = await crypto.unwrapKey(
            "jwk",
            masterEnc,
            masterEncKey,
            { name: "AES-GCM", iv: masterIV },
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        // decrypt the secret
        const secretCipherText = fromHex(state.secret);
        const secretIV = secretCipherText.slice(0, 12);
        const secretEnc = secretCipherText.slice(12);
        const secret = await crypto.decrypt({ name: "AES-GCM", iv: secretIV }, masterKey, secretEnc).then((pt) => new Uint8Array(pt));

        return new Client(secret, masterKey, masterEncKey);
    }
}

const client = await Client.register(password);
console.log(client);
const exported = await client.export();

const client2 = await Client.login(exported, password);
console.log(client2);

export {};
