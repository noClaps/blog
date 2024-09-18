---
title: "Part 2: The X3DH key agreement protocol"
description: Creating secure shared secrets with an offline party
date: 2023-11-29
author: Mester
series: 2
---

## Welcome back

Welcome back to the part 2 of the series on end-to-end encryption. In the first part, we looked at the basics of end-to-end encryption and how it works. In this part, we will look at the X3DH protocol, which is used by the Signal protocol to establish a shared secret between two parties.

### Why bother?

You might ask: "Why do we need a key agreement protocol? Why can't we just use DH?" You might think that X3DH helps prevent MITM attacks, but that's not actually case. It improves deniability by having forward secrecy, but the two parties must still verify that their keys haven't been altered during transit. Another advantage of X3DH is that it's asynchronous, meaning that the two parties don't have to be online at the same time to establish a shared secret. This is especially useful for messaging apps, where users are often offline.

## Implementing X3DH

Enough talk, let's take a look at how X3DH works.

### Initial setup

X3DH needs a bunch of [other keypairs](https://www.signal.org/docs/specifications/x3dh#keys) to work (we're going to use the P-256 curve for all of them). These key(pair)s include: identity key (this never changes), prekey (this may be renewed, usually once per week, depending on the implementation to provide forward-secrecy, we're not going to implement that here) and a list of one-time prekeys (these should all be discarded after they're used, and refreshed when their amount falls below a certain threshold, for this example we're going to generate 20 random keys and just choose one during the protocol run). The public prekey is signed with ECDSA, with the signing key being the private identity key (this means that the recipient can verify the digital signature with the public identity key).

::: warning
There is a very important thing to note: all private key components must be only available to the user they belong to, other users and especially the server must never learn them. This can be achieved in 2 ways: either only store them on device, or encrypt them before storing it on the server, both depend massively on your app's implementation. Because we're not dealing with servers here, we assume that everything is stored the safest way possible.
:::

```typescript
const crypto = globalThis.crypto.subtle;

interface X3DHObject {
    identityKeyPair: CryptoKeyPair;
    preKeyPair: CryptoKeyPair;
    preKeySignature: ArrayBufferLike; // The ECDSA signature of the public prekey, signed with the private identity key.
    onetimeKeys: Array<OneTimeKey>;
}

interface OneTimeKey {
    public: CryptoKey;
    private: CryptoKey;
    id: number; // A random identifier, client may verify integrity in case the server tries to alter it.
}

function toHex(buffer: ArrayBufferLike) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function setupX3DH(): Promise<X3DHObject> {
    // everything happens on device
    const identityKeyPair = await crypto.generateKey(
        { name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]
    );

    const preKeyPair = await crypto.generateKey(
        { name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]
    );
```

First we set up some interfaces for TypeScript. If you're implementing this in pure JavaScript, you can skip this step. Then we create the `toHex` function, which we've already used earlier. The `setupX3DH` function starts off easy: we generate the identity key and prekey. They're both using the P-256 curve with key usages set to `deriveBits`, because later we're going to use them to generate a byte sequence, not a new key (if it was `deriveKey`, we could only use to generate a new AES key for example, but X3DH expects a byte sequence, not a key). Note that `setupX3DH` is an async function, since we'll need to use `await` for `SubtleCrypto`'s functions.

::: note
Indented lines are part of a function
:::

```typescript
    // setupX3DH
    const identitySigningKey = await crypto.importKey(
        "pkcs8",
        await crypto.exportKey("pkcs8", identityKeyPair.privateKey),
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["sign"]
    );

    const preKeySignature = await crypto.sign(
        { name: "ECDSA", hash: "SHA-512" },
        identitySigningKey,
        await crypto.exportKey("raw", preKeyPair.publicKey)
    );
```

This is another quirk of `SubtleCrypto`. You cannot use a key generated with `ECDH` for the `ECDSA` algorithm, even though they're completely interchangable. To counter this, we're using a "hack" which exports the private identity key, then re-imports it with `ECDSA`, so we can use the `sign` key usage on it. Note that the exported key format is set to [`pkcs8`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#pkcs_8), since we're exporting a private key.

::: note
The keys are only interchangeable because we're using the P-256 curve. If you're using a third-party library for, e.g., Curve25519, note that X25519 for ECDH and Ed25519 for ECDSA are not directly interchangeable, look up your library's documentation for more information.
:::

After the private identity key has been modified that `SubtleCrypto` can accept it, it is used by `SubtleCrypto.sign()` to create a digital signature of the public prekey, which only the public identity key can verify.

Next we'll set up 20 random one-time prekeys.

```typescript
    // setupX3DH
    const onetimeKeys = new Array<OneTimeKey>();

    for(let i = 0; i < 20; i++) {
        const keyPair = await crypto.generateKey(
            { name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]
        )

        onetimeKeys.push({
            public: keyPair.publicKey,
            private: keyPair.privateKey,
            id: i
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
```

We create a new array called `onetimeKeys`, which we instantly populate with 20 completely random P-256 keys. The `id` can be a completely random number, but to avoid collisions, I just used a linearly increasing number, so they're all unique. Finally, we finish the key generation by returning the identity key, prekey, the prekey signature and an array of 20 one-time prekeys.

### Fetching a prekey bundle

The next step is to start a protocol run. For this we'll of course use Alice and Bob. Assume that they've both already generated an X3DH object, and uploaded them to the server with the safety precautions mentioned earlier. Now let's see how would it look like if Alice wanted to create a shared secret with Bob using X3DH. The first step is to fetch Bob's so called "prekey bundle".

```typescript
interface PrekeyBundle {
    identityKey: CryptoKey; // the public identity key of the fetched user
    preKey: CryptoKey; // the public prekey of the fetched user
    preKeySignature: ArrayBuffer; // the signature of the prekey
    oneTimeKey: CryptoKey; // the public one-time prekey of the fetched user
    oneTimeID: number; // the ID of the one-time prekey
}

function getPrekeyBundle(user: X3DHObject): PrekeyBundle {
    // happens on server
    const oneTimeKey = user.onetimeKeys[Math.floor(Math.random() * user.onetimeKeys.length)];

    // the server should somehow mark the one-time key as used, so it cannot be used again

    return {
        // this would be the response to an HTTP request or similar
        identityKey: user.identityKeyPair.publicKey,
        preKey: user.preKeyPair.publicKey,
        preKeySignature: user.preKeySignature,
        oneTimeKey: oneTimeKey?.public ?? undefined,
        oneTimeID: oneTimeKey?.id ?? undefined,
    };
}
```

We declare another utility interface for X3DH, then create a `getPrekeyBundle` function, which takes a `X3DHObject` as parameter. Note that all of the code inside this function is executed on the server, which means it's asynchronous - it doesn't depend on the other user's online status.

The prekey bundle contains the user's public identity and prekey, the signature for the prekey, and the public component of a random one-time prekey. Sometimes, the one-time prekey might not exist, this could happen if too many users have tried to get a prekey bundle for a user and they weren't online to regenerate the one-time prekeys. The X3DH documention mentions that in this case the protocol may still be continued, but security will be reduced.

### Generating the secret key

Great, so Alice has fetched a prekey bundle of Bob and prepared her own private keys. This is where it gets complicated.

Basically, Alice first verifies that Bob's prekey is valid using the signature and his public key. If that succeedes, she creates a completely new ephemeral key, this will be used for this protocol run only (basically it's a one-time prekey, but for Alice). Then she needs to calculate 4 (3 if the one-time prekey is missing) DH exchanges:

1. DH1 = Alice's private identity key + Bob's public prekey
2. DH2 = A's private ephemeral key + B's public identity key
3. DH3 = A's private ephemeral key + B's public prekey
4. (DH4 = A's private ephemeral key + B's public one-time prekey)

Remember, all of these DH key exchanges will return a random sequence of bytes (in our implementation, they'll be 32 bytes long). To compress them into a single shared secret key, Alice concatenates all of these byte sequences together, then passes it to the HKDF algorithm.

The HKDF function needs a `salt` and `info` extra parameter, both can be public. The former will just be an empty `Uint8Array`, the latter the UTF-8 encoding of "E2EE is amazing!" - this can be anything you'd like, you might even want to use context-based information.

```typescript
interface X3DHRequest {
    identityKey: CryptoKey; // the public identity key of the user who requested a protocol run
    ephemeralKey: CryptoKey; // the public ephemeral key of the user
    oneTimeID: number | undefined; // the ID of the one-time prekey the user used
    ciphertext: Uint8Array; // the initial ciphertext, encrypted with the shared secret
}

async function createX3DHRequest(user: X3DHObject, bundle: PrekeyBundle): Promise<X3DHRequest> {
    // happens on device
    // verify the prekey signature
    const identitySigningKey = await crypto.importKey(
        "raw",
        await crypto.exportKey("raw", bundle.identityKey),
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["verify"]
    );

    const verified = await crypto.verify(
        { name: "ECDSA", hash: "SHA-512" },
        identitySigningKey,
        bundle.preKeySignature,
        await crypto.exportKey("raw", bundle.preKey)
    );

    if (!verified) throw new Error("Prekey signature invalid.");
```

We start by creating yet another interface to represent an X3DH request. This object will be used by Alice after she's derived the shared secret: she'll populate this object with the required data that Bob needs to calculate the same secret. Then, we define an async function called `createX3DHRequest`, which takes in the user and prekey bundle. Note that everything in this function happens on the device.

We do the weird export-import hack again, but this time on the public identity key (note that we're using type `raw` here, because `bundle.identityKey` is a public key!). If this was real code, the keys would be transmitted with a Base64, hex etc. encoding, so you wouldn't need this SubtleCrypto mess, you only have to do this if you're trying to use an already existing `CryptoKey` object. Finally, it is used to verify the prekey signature. If it fails, the protocol run is instantly aborted.

```typescript
    // createX3DHRequest
    // derive the shared secret
    const ephemeralKey = await crypto.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);

    // generate the 4 DH values
    const DH1 = await crypto.deriveBits({ name: "ECDH", public: bundle.preKey }, user.identityKeyPair.privateKey, 256);
    const DH2 = await crypto.deriveBits({ name: "ECDH", public: bundle.identityKey }, ephemeralKey.privateKey, 256);
    const DH3 = await crypto.deriveBits({ name: "ECDH", public: bundle.preKey }, ephemeralKey.privateKey, 256);
    const DH4 = bundle.oneTimeKey
        ? await crypto.deriveBits({ name: "ECDH", public: bundle.oneTimeKey }, ephemeralKey.privateKey, 256)
        : undefined;

    // concatenate the DH values
    const DH = new Uint8Array(bundle.oneTimeKey ? 128 : 96);
    DH.set(new Uint8Array(DH1), 0);
    DH.set(new Uint8Array(DH2), 32);
    DH.set(new Uint8Array(DH3), 64);
    if (DH4) DH.set(new Uint8Array(DH4), 96);
```

After verifying the prekey signature, we generate a new ephemeral key (key usage set to `deriveBits`), then perform the 4 DH key exchanges, each time setting the length to 256, indicating we want the result to be 32 bytes long (256 bits = 32 bytes). `DH4` is set to undefined if the one-time prekey doesn't exist. Then, these 4 DH results are concatenated together into a single Uint8Array, which can either be 128 or 96 bytes long, depending on the one-time prekey.

```typescript
    // createX3DHRequest
    // derive the secret key
    const info = new TextEncoder().encode("E2EE is amazing!");

    const secretKeyInput = await crypto.importKey("raw", DH, "HKDF", false, ["deriveKey"]);

    const secretKey = await crypto.deriveKey(
        { name: "HKDF", salt: new Uint8Array(), info, hash: "SHA-512" },
        secretKeyInput,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    console.log(`Secret key derived: ${toHex(await crypto.exportKey("raw", secretKey))}`);
```

Finally, we import our byte sequence and set its algorithm to `HKDF` and key usage to `deriveKey` (since we're going to derive a key in the next step), and finally perform `SubtleCrypto.deriveKey()` to turn our input key material into an AES key we can use. The salt is just an empty `Uint8Array`, which fortunately doesn't compromise security. For debugging purposes, I logged secret key to the console, but for obvious reasons do not ever do this in production code.

### Constructing the request object

We're not done yet though, we'll also need to generate a request object for Bob, so he can also perform the calculations we've done earlier. Fortunately, this is really simple.

```typescript
    // createX3DHRequest
    // generate AD (concatenate the hash of the two public identity keys)
    const AD = new Uint8Array(64);
    AD.set(new Uint8Array(await crypto.digest("SHA-256", await crypto.exportKey("raw", user.identityKeyPair.publicKey))), 0);
    AD.set(new Uint8Array(await crypto.digest("SHA-256", await crypto.exportKey("raw", bundle.identityKey))), 32);

    // create the initial ciphertext
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(16));
    const message = new TextEncoder().encode(
        JSON.stringify({
            identityKey: toHex(await crypto.exportKey("raw", user.identityKeyPair.publicKey)),
            ephemeralKey: toHex(await crypto.exportKey("raw", ephemeralKey.publicKey)),
            oneTimeID: bundle.oneTimeID,
        })
    );
```

First we create an AD (associated data) by hashing the requesting user's public key and the requested user's public key and concatenating them together (we use a hash to make sure we get exactly 32 bytes per key). The requested user has to reconstruct this to be able to read the initial ciphertext. A new IV is also generated along with the plaintext of the initial ciphertext. What this message contains is completely up to the application, my implementation has a copy of the keys in the request object, so in case the server tries to mess with the keys, the message will contain completely different ones, which can be used to verify the integrity of an X3DH request.

```typescript
    // createX3DHRequest
    const ciphertextBase = await crypto.encrypt({ name: "AES-GCM", iv, additionalData: AD }, secretKey, message);

    // concatenate the iv and ciphertext
    const ciphertext = new Uint8Array(16 + ciphertextBase.byteLength);
    ciphertext.set(iv, 0);
    ciphertext.set(new Uint8Array(ciphertextBase), 16);

    // the secret key is discarded after this point, but in a real implementation it may be stored for later use
    return {
        identityKey: user.identityKeyPair.publicKey,
        ephemeralKey: ephemeralKey.publicKey,
        oneTimeID: bundle.oneTimeID ?? undefined,
        ciphertext,
    };
}
```

Finally we use `SubtleCrypto.encrypt()` on the message (note that there is another parameter added to the AES function, `additionalData`), create a new variable called `ciphertext` which is a concatenation of the iv and the encrypted message, then return the request object. This object contains all the keys Bob needs for the calculation of the secret key: the public ephemeral key, public identity key and the ID of the one-time prekey, all in plaintext (!). The ciphertext is encoded in Base64, and the function returns. Alice can now send the request object to Bob, who does the final calculations and finally ends the X3DH run.

### Accepting the request object

Alice has uploaded her request object to the server, which (hopefully) forwarded it to the now online Bob. Let's see what he has to do.

Because we don't have to verify our own prekey's signature, accepting the request simplifies a lot, and we can get straight to calculating the 4 DH values. Remember, instead of the public keys Alice has used, we now have to use the respective private component and vice versa. The calculations therefore change to the following:

1. DH1 = Alice's public identity key + Bob's private prekey
2. DH2 = A's public ephemeral key + B's private identity key
3. DH3 = A's public ephemeral key + B's private prekey
4. (DH4 = A's public ephemeral key + B's private one-time prekey)

```typescript
async function acceptX3DHRequest(user: X3DHObject, request: X3DHRequest) {
    // happens on device
    // calculate the DH values
    const DH1 = await crypto.deriveBits({ name: "ECDH", public: request.identityKey }, user.preKeyPair.privateKey, 256);
    const DH2 = await crypto.deriveBits({ name: "ECDH", public: request.ephemeralKey }, user.identityKeyPair.privateKey, 256);
    const DH3 = await crypto.deriveBits({ name: "ECDH", public: request.ephemeralKey }, user.preKeyPair.privateKey, 256);
    const oneTimeKey = user.onetimeKeys.find((key) => key.id === request.oneTimeID);
    const DH4 = oneTimeKey
        ? await crypto.deriveBits(
              { name: "ECDH", public: request.ephemeralKey },
              oneTimeKey.private,
              256
          )
        : undefined;

    // concatenate the DH values
    const DH = new Uint8Array(request.oneTimeID ? 128 : 96);
    DH.set(new Uint8Array(DH1), 0);
    DH.set(new Uint8Array(DH2), 32);
    DH.set(new Uint8Array(DH3), 64);
    if (DH4) DH.set(new Uint8Array(DH4), 96);
```

If you've done everything correctly, the resulting `DH` buffer **_should_** have the same exact values as the one Alice has generated. If that's true, the HKDF will create the same key:

```typescript
    // acceptX3DHRequest
    // derive the secret key
    const info = new TextEncoder().encode("E2EE is amazing!");

    const secretKeyInput = await crypto.importKey("raw", DH, "HKDF", false, ["deriveKey"]);

    const secretKey = await crypto.deriveKey(
        { name: "HKDF", salt: new Uint8Array([0]), info, hash: "SHA-512" },
        secretKeyInput,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    console.log(`Secret key derived: ${toHex(await crypto.exportKey("raw", secretKey))}`);
```

As you can see, this code is basically the same as the `generateX3DH`. Also, because the `info` parameter is always a constant, we don't have to include it in the request, you can just generate it again. Anyway, let's finish up this code and test it for good!

```typescript
    // acceptX3DHRequest
    // generate AD (concatenate the hash of the two public identity keys)
    const AD = new Uint8Array(64);
    AD.set(new Uint8Array(await crypto.digest("SHA-256", await crypto.exportKey("raw", request.identityKey))), 0);
    AD.set(new Uint8Array(await crypto.digest("SHA-256", await crypto.exportKey("raw", user.identityKeyPair.publicKey))), 32);

    // extract the iv and ciphertext
    const iv = request.ciphertext.slice(0, 16);
    const ciphertext = request.ciphertext.slice(16);

    // decipher the ciphertext
    const message = await crypto.decrypt({ name: "AES-GCM", iv, additionalData: AD }, secretKey, ciphertext);

    console.log(`Deciphered message: ${new TextDecoder().decode(message)}`);
}
```

First we need to reconstruct the AD. Note that it's **Alice's** + **Bob's** public identity key, not the other way around! After that we extract the IV and ciphertext using the `Uint8Array.slice()` function and perform the final `SubtleCrypto.decrypt()` call with the secret key we've derived earlier. If we've done everything correctly, it should decrypt without an error and we can print the decoded message to the console.

Anyway, I'm sure you're eager to finally test this code, so let's perform our first X3DH protocol run!

```typescript
// create Alice and Bob (happens on their devices)
const alice = await setupX3DH();
const bob = await setupX3DH();

// keys are uploaded to server, with private keys secured in some way

// Alice fetches Bob's bundle (response comes from server)
const bobBundle = getPrekeyBundle(bob);

// Alice creates a request (happens on device, then request is sent to server)
const aliceRequest = await createX3DHRequest(alice, bobBundle);

// Bob accepts the request (happens on device)
await acceptX3DHRequest(bob, aliceRequest);
```

Output of the console:

```
X3DH setup complete.
X3DH setup complete.
Secret key derived: 1145516af95e6c484674f51eaf4a0384f4db491a711486e4fec0c8f25644ba2e
Secret key derived: 1145516af95e6c484674f51eaf4a0384f4db491a711486e4fec0c8f25644ba2e
Deciphered message: {"identityKey":"040e221ca977e8c54363024d482b959c2c51ea9d6f7f3a3e682ee101d5c683da9afeefa3edb5bd85bb405e655ef5f4aa8ea91697ba9a415d6b3bac8c9b50cd08c6","ephemeralKey":"0408f3677d4f4b5a63015829e6bef8282395ee7acc7843665c38af70f87eccf632a7d796b16825d0a82972c1ef3983abd897b2486d2954ee123a3f1b3a92485a71","oneTimeID":6}
```

Congratulations, you've successfully learned how to implement the X3DH key exchange protocol using `SubtleCrypto`. Go and show this to your friends or something.

The code for this example can be downloaded <a href="/files/x3dh-example.ts" download="x3dh-example.ts">here</a>.

## Conclusion

In this part, we've learned how to implement the X3DH key exchange protocol using `SubtleCrypto`. The next part is going to be a major step-up, as we'll be implementing the Double Ratchet algorithm, which is used by the Signal protocol to encrypt messages. You can find it [here](/tech/inside-e2ee/double-ratchet).
