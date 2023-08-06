const crypto = window.crypto.subtle;

interface X3DHObject {
    identityKeyPair: CryptoKeyPair; // Stored on server with the private key being protected (encrypted). Client may verify integrity of keys.
    preKeyPair: CryptoKeyPair; // Same as before.
    preKeySignature: ArrayBuffer; // Stored on server, client may verify integrity.
    onetimeKeys: Array<OneTimeKey>; // Same as before.
}

interface OneTimeKey {
    public: CryptoKey; // Public to everyone (including server).
    private: CryptoKey; // Protected from the server.
    id: number; // A random identifier, client may verify itegrity, in case the server tries to alter it.
    used: boolean; // In a real-world implementation, the private keys would be stored safely on the device, and the second someone requests a one-time prekey, it's completely deleted from the server. This is only used here to make the code easier to understand, and just tells you if the key has been used.
}

function toHex(buffer: ArrayBuffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function setupX3DH(): Promise<X3DHObject> { // everything happens on device
    const identityKeyPair = await crypto.generateKey(
        { name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]
    );

    const preKeyPair = await crypto.generateKey(
        { name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]
    );

    const identitySigningKey = await crypto.importKey(
        "pkcs8", await crypto.exportKey("pkcs8", identityKeyPair.privateKey),
        { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]
    );

    const preKeySignature = await crypto.sign(
        { name: "ECDSA", hash: "SHA-512" }, identitySigningKey,
        await crypto.exportKey("raw", preKeyPair.publicKey)
    );

    const onetimeKeys = new Array<OneTimeKey>();

    for (let i = 0; i < 20; i++) {
        const keyPair = await crypto.generateKey(
            { name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]
        )

        onetimeKeys.push({
            public: keyPair.publicKey,
            private: keyPair.privateKey,
            id: i,
            used: false
        });
    }

    console.log("X3DH setup complete.");

    return {
        identityKeyPair,
        preKeyPair,
        preKeySignature,
        onetimeKeys
    };
}

interface PrekeyBundle {
    identityKey: CryptoKey; // the public identity key of the fetched user
    preKey: CryptoKey; // the public prekey of the fetched user
    preKeySignature: ArrayBuffer; // the signature of the prekey
    oneTimeKey: CryptoKey; // the public one-time prekey of the fetched user
    oneTimeID: number; // the ID of the one-time prekey
}

function getPrekeyBundle(user: X3DHObject): PrekeyBundle { // happens on server
    const oneTimeKey = user.onetimeKeys.filter(key => !key.used)?.[Math.floor(Math.random() * user.onetimeKeys.length)];
    if (oneTimeKey) user.onetimeKeys[user.onetimeKeys.indexOf(oneTimeKey)].used = true;

    return { // return as a response to a HTTP request or some other protocol
        identityKey: user.identityKeyPair.publicKey,
        preKey: user.preKeyPair.publicKey,
        preKeySignature: user.preKeySignature,
        oneTimeKey: oneTimeKey?.public ?? undefined,
        oneTimeID: oneTimeKey?.id ?? undefined
    }
}

interface X3DHRequest {
    identityKey: CryptoKey; // the public identity key of the user who requested a protocol run
    ephemeralKey: CryptoKey; // the public ephemeral key of the user
    oneTimeID: number; // the ID of the one-time key the user used
    ciphertext: Uint8Array; // the initial ciphertext
}

async function createX3DHRequest(user: X3DHObject, bundle: PrekeyBundle): Promise<X3DHRequest> { // happens on client
    // verify the prekey signature
    const identitySigningKey = await crypto.importKey(
        "raw", await crypto.exportKey("raw", bundle.identityKey),
        { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]
    );

    const verified = await crypto.verify(
        { name: "ECDSA", hash: "SHA-512" }, identitySigningKey,
        bundle.preKeySignature, await crypto.exportKey("raw", bundle.preKey)
    );

    if (!verified) throw new Error("Prekey signature invalid.");

    // generate ephemeral key
    const ephemeralKey = await crypto.generateKey(
        { name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]
    );

    // generate the 4 DH values
    const DH1 = await crypto.deriveBits(
        { name: "ECDH", public: bundle.preKey }, user.identityKeyPair.privateKey, 256);
    const DH2 = await crypto.deriveBits(
        { name: "ECDH", public: bundle.identityKey }, ephemeralKey.privateKey, 256);
    const DH3 = await crypto.deriveBits(
        { name: "ECDH", public: bundle.preKey }, ephemeralKey.privateKey, 256);
    const DH4 = bundle.oneTimeKey ? await crypto.deriveBits(
        { name: "ECDH", public: bundle.oneTimeKey }, ephemeralKey.privateKey, 256) : undefined;

    // concatenate the DH values
    const DH = new Uint8Array(bundle.oneTimeKey ? 128 : 96);
    DH.set(new Uint8Array(DH1), 0);
    DH.set(new Uint8Array(DH2), 32);
    DH.set(new Uint8Array(DH3), 64);
    if (bundle.oneTimeKey) DH.set(new Uint8Array(DH4), 96);

    // derive the secret key
    const info = new TextEncoder().encode("E2EE is amazing!");

    const secretKeyInput = await crypto.importKey(
        "raw", DH, "HKDF", false, ["deriveKey"]
    );

    const secretKey = await crypto.deriveKey(
        { name: "HKDF", salt: Uint8Array([0]), info, hash: "SHA-512" }, secretKeyInput,
        { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );

    console.log(`Secret key derived: ${toHex(await crypto.digest("SHA-256", await crypto.exportKey("raw", secretKey)))}`);

    // generate AD (concatenate the hash of the two public identity keys)
    const AD = new Uint8Array(64);
    AD.set(new Uint8Array(await crypto.digest("SHA-256", await crypto.exportKey("raw", user.identityKeyPair.publicKey))), 0);
    AD.set(new Uint8Array(await crypto.digest("SHA-256", await crypto.exportKey("raw", bundle.identityKey))), 32);

    // create the initial ciphertext
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const message = new TextEncoder().encode(JSON.stringify({
        identityKey: toHex(await crypto.exportKey("raw", user.identityKeyPair.publicKey)),
        ephemeralKey: toHex(await crypto.exportKey("raw", ephemeralKey.publicKey)),
        oneTimeID: bundle.oneTimeID
    }));

    const ciphertextBase = await crypto.encrypt(
        { name: "AES-GCM", iv, additionalData: AD }, secretKey, message
    );

    // concatenate the iv and ciphertext
    const ciphertext = new Uint8Array(16 + ciphertextBase.byteLength);
    ciphertext.set(iv, 0);
    ciphertext.set(new Uint8Array(ciphertextBase), 16);

    // the secret key is discarded after this point, but in a real implementation it may be stored
    return {
        identityKey: user.identityKeyPair.publicKey,
        ephemeralKey: ephemeralKey.publicKey,
        oneTimeID: bundle.oneTimeID ?? undefined,
        ciphertext
    }
}

async function acceptX3DHRequest(user: X3DHObject, request: X3DHRequest) { // happens on device
    // calculate the DH values
    const DH1 = await crypto.deriveBits(
        { name: "ECDH", public: request.identityKey }, user.preKeyPair.privateKey, 256);
    const DH2 = await crypto.deriveBits(
        { name: "ECDH", public: request.ephemeralKey }, user.identityKeyPair.privateKey, 256);
    const DH3 = await crypto.deriveBits(
        { name: "ECDH", public: request.ephemeralKey }, user.preKeyPair.privateKey, 256);
    const DH4 = request.oneTimeID ? await crypto.deriveBits(
        { name: "ECDH", public: request.ephemeralKey },
        user.onetimeKeys.find(key => key.id === request.oneTimeID).private, 256) : undefined;

    // concatenate the DH values
    const DH = new Uint8Array(request.oneTimeID ? 128 : 96);
    DH.set(new Uint8Array(DH1), 0);
    DH.set(new Uint8Array(DH2), 32);
    DH.set(new Uint8Array(DH3), 64);
    if (request.oneTimeID) DH.set(new Uint8Array(DH4), 96);

    // derive the secret key
    const info = new TextEncoder().encode("E2EE is amazing!");

    const secretKeyInput = await crypto.importKey(
        "raw", DH, "HKDF", false, ["deriveKey"]
    );

    const secretKey = await crypto.deriveKey(
        { name: "HKDF", salt: new Uint8Array([0]), info, hash: "SHA-512" }, secretKeyInput,
        { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );

    console.log(`Secret key derived: ${toHex(await crypto.digest("SHA-256", await crypto.exportKey("raw", secretKey)))}`);

    // generate AD (concatenate the hash of the two public identity keys)
    const AD = new Uint8Array(64);
    AD.set(new Uint8Array(await crypto.digest("SHA-256", await crypto.exportKey("raw", request.identityKey))), 0);
    AD.set(new Uint8Array(await crypto.digest("SHA-256", await crypto.exportKey("raw", user.identityKeyPair.publicKey))), 32);

    // extract the iv and ciphertext
    const iv = request.ciphertext.slice(0, 16);
    const ciphertext = request.ciphertext.slice(16);

    // decipher the ciphertext
    const message = await crypto.decrypt(
        { name: "AES-GCM", iv, additionalData: AD }, secretKey,
        ciphertext
    );

    console.log(`Deciphered message: ${new TextDecoder().decode(message)}`);
}

// create Alice and Bob (happens on their devices)
const alice = await setupX3DH();
const bob = await setupX3DH();

// Alice fetches Bob's bundle (response comes from server)
const bobBundle = await getPrekeyBundle(bob);

// Alice creates a request (happens on device, then sent to server)
const aliceRequest = await createX3DHRequest(alice, bobBundle);

// Bob accepts the request (happens on device)
await acceptX3DHRequest(bob, aliceRequest);