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

async function generateKey<T extends KeyType>(password: string, type: T, salt: Uint8Array): Promise<Key<T>> {
    // read the password and pass it through HKDF
    const rawPassword = new TextEncoder().encode(password);
    const passwordKey = await crypto.importKey("raw", rawPassword, { name: "HKDF" }, false, ["deriveBits"]);

    // salt: empty Uint8Array, info: type
    const bits = await crypto.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info: new TextEncoder().encode(type) }, passwordKey, 256);

    // if it's the authentication key, we need to convert the bytes to a hex string
    // otherwise, return the bytes as an AES key
    if (type === "authentication") {
        return <Key<T>>Array.from(new Uint8Array(bits))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    } else {
        return <Promise<Key<T>>>crypto.importKey("raw", bits, { name: "AES-GCM" }, false, ["wrapKey", "unwrapKey"]);
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

    /**
     * The salt used to influence the HKDF function
     */
    #salt: Uint8Array;

    constructor(secret: Uint8Array, masterKey: CryptoKey, masterEnc: CryptoKey, salt: Uint8Array) {
        this.#secret = secret;
        this.#masterKey = masterKey;
        this.#masterEnc = masterEnc;
        this.#salt = salt;
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

        const final = {
            secret: toHex(secretCipherText),
            master: toHex(masterCipherText),
            salt: toHex(this.#salt)
        };

        // store the encrypted data in the database
        const transaction = db.transaction("client", "readwrite");
        const store = transaction.objectStore("client");
        store.put(final, "client");

        // return the encrypted data in case we want to do something with it
        return final;
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
        const salt = globalThis.crypto.getRandomValues(new Uint8Array(32));
        const masterEnc = await generateKey(password, "masterEnc", salt);

        const client = new Client(secret, masterKey, masterEnc, salt);

        // now generate the authentication key
        const authenticationKey = await generateKey(password, "authentication", salt);

        // this is where we would send the authentication key to the server and implement the rest of the registration process
        console.log("Registering user with authentication key:", authenticationKey);

        return client;
    }

    static async login(password: string) {
        const transaction = db.transaction("client", "readonly");
        const store = transaction.objectStore("client");
        const dataRequest = store.get("client");

        const state = await new Promise<Awaited<ReturnType<Client["export"]>>>((resolve, reject) => {
            dataRequest.onerror = reject;
            dataRequest.onsuccess = () => resolve(dataRequest.result);
        });

        const salt = fromHex(state.salt);

        // generate the authentication key
        const authenticationKey = await generateKey(password, "authentication", salt);

        // this is where we would send the authentication key to the server and implement the rest of the login process
        console.log("Logging in user with authentication key:", authenticationKey);

        // decrypt the master key
        const masterEncKey = await generateKey(password, "masterEnc", salt);
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

        return new Client(secret, masterKey, masterEncKey, salt);
    }
}

const idb = globalThis.indexedDB;
const openRequest = idb.open("client", 1);

openRequest.onerror = (event) => {
    console.error("Error opening database:", event);
};
openRequest.onupgradeneeded = (event) => {
    const db = openRequest.result;
    console.log(`Updating database from ${event.oldVersion} to ${event.newVersion}`);

    // create an object store for the client
    db.createObjectStore("client");
};
const db = await new Promise<IDBDatabase>((resolve, reject) => {
    openRequest.onsuccess = () => resolve(openRequest.result);
    openRequest.onerror = reject;
});

const client = await Client.register(password);
console.log(client);
await client.export();

const client2 = await Client.login(password);
console.log(client2);

export {};
