---
title: "Part 1: Introduction"
description: Hiding data with style
date: 2023-07-13
lastmod: 2023-11-29
author: Mester
series: 1
---

## Welcome

Dear readers, I welcome you all to my series all about E2EE. It's going to be about E2EE and how, where, and why it's used. If you're developing your new web app in JavaScript, you're in luck! The post will also include a bunch of example JS code that uses browser native APIs, so you can pretty much implement E2EE anywhere you want.

This first post is a quick introduction to the concept of E2EE. You'll learn its basics, some cryptographic terms and we'll also do a implementation of a simple Diffie-Hellmann key exchange. Later, you'll learn about the X3DH key exchange, and finally we'll implement the Double Ratchet algorithm, which is used in the messaging app Signal.

::: note
The example codes are actually going to be in TypeScript instead of JavaScript, don't get confused about that.
:::

## What is E2EE?

Obviously, some of you may have only heard of E2EE, but never actually understood what it means.
E2EE stands for "End-to-End-Encryption", which gives a hint on what it does: it encrypts data (which can be anything, text, images, videos, voice calls) between the ends (also called clients, basically the people).

"But Sir, I heard that HTTPS already encrypts my data online, so why would I need E2EE?" Great question, Pete. [HTTPS](https://en.wikipedia.org/wiki/HTTPS) is just an encrypted version of [HTTP](https://en.wikipedia.org/wiki/HTTP), which is the main protocol you use to connect with websites. It **only encrypts the data between you and the website (server)**, which means the website can still read your plans for your next date, or see that embarrassing picture your mother sent you last week. Actually, they can't just _read_ the message, but **change it entirely**. Not just the message itself, but the recipient too for example. In short, if you use a messaging app which only uses HTTPS for encryption, you're trusting the server to do exactly what you say. With E2EE, control is entirely in your hands.

E2EE solves this issue by encrypting the data before sending it to the server **in a way the server cannot access the plain-text (in other words, unencrypted) data**. This design makes sure that only you and your recipient(s) have access to the data. This also means that any form of "E2EE" which does the encryption on the server and not in the client is **NOT** E2EE.

### So is HTTPS unsecure?

No, not at all. In fact, HTTPS can be more secure than the E2EE in an app you use, depending on the implementation. But HTTPS only prevents third parties from reading your communication between the server.

Imagine you're organizing a surprise birthday party for a friend and you want to send out invitations discreetly. You opt for a reliable delivery service (akin to HTTPS) that boasts of its secure envelopes which cannot be tampered with by outsiders. You trust this service to deliver your party invitations without letting the secret out. While anyone trying to intercept the invitiations would be foiled, the delivery service does have the key to open these envelopes and could potentially read the details of the party if they wanted to.

Now let's take it a step further with E2EE. This time, you write your invitations using a special code that only you and your invited friends are privy to. You still use the same trustworthy delivery service, and your invitation still arrives in its secure envelope. However, when the delivery service inevitably opens the envelope to check the contents, all they find is a jumble of letters and numbers like "4FmpL3XC7Q" that makes no sense to them. Unphased, they deliver the coded message to your friend. Your friend, who knows the secret code, easily decodes the message and learns about the surprise party without the delivery service or anyone else being the wiser.

In this scenario, the use of a secret code is an analogy for E2EE, making sure that only your intended recipients—the friends you've invited—know about the party plans, no matter who handles the invites in between.

### Do I need it?

Depends on your mentality really. Some people just want something that's easy to use, and don't care much about security. Others want to be as secure as possible, even if it means sacrificing some features. If you're the first type, you probably don't need E2EE. If you're the second type, you probably already use E2EE apps.

### Where is it used?

E2EE is used mainly in messaging apps that are designed to be, well... secure. Examples are [Matrix](https://matrix.org/), [Session](https://getsession.org/), [Signal](https://signal.org/), even Apple's [iMessage](https://www.apple.com/privacy/features#imessage) if you have [Advanced Data Protection](https://support.apple.com/en-us/HT212520) enabled, because the iCloud **backups** of your messages are [not E2EE](https://support.apple.com/en-gb/HT202303) without it. With ADP, only your devices can decrypt your conversations, not even Apple.

::: note
On Matrix, direct one-on-one conversations are always E2EE, for group chats it's an opt-in feature.
:::

Continuing with the Apple example, with Advanced Data Protection almost all of your iCloud data is stored using E2EE, so only you can access it. Point is: E2EE is not just for messages, it's just a way of encrypting any arbitary data, even if it's just for a single recipient (you).

## Cryptographic terms

Since this section is going to mention a lot of advanced cryptographic terms, I'd like to quickly mention some.

- Integrity and authenticity: These are two important terms in cryptography. Integrity means a message hasn't been changed during transmit, and authenticity means the message comes from the stated sender. For example, if you get a message from your online bank, you can be sure that the message actually came from your bank and it's really what they sent you.
- [DH (Diffie-Hellman)](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange): The DH key exchange was [created in 1977](https://worldwide.espacenet.com/patent/search/family/025257633/publication/US4200770A?q=pn%3DUS4200770) by [Bailey Diffie](https://en.wikipedia.org/wiki/Whitfield_Diffie) and [Martin Hellman](https://en.wikipedia.org/wiki/Martin_Hellman), with some help from [Ralph Merkle](https://en.wikipedia.org/wiki/Ralph_Merkle). This post is not going to get into the mathematical details, but basically DH works by mixing a random private key you generate with the public key of the person you want to perform the key exchange with. They do the same, but with their private key and your public key. (Note that the public and private keys are mathematically linked together, they aren't completely random)
- [Elliptic curve](https://en.wikipedia.org/wiki/Elliptic_curve): An elliptic curve is a mathematical algebraic curve, usually written in the form of $$y^2 = x^3 + ax + b$$, where a and b are random numbers. In cryptography, they're used for:
  - [Elliptic-curve cryptography (ECC)](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography): ECC is a type of [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) using the powers of elliptic curves. They're usually harder to break even with smaller key sizes, because of the [Elliptic Curve Discrete Logarithm Problem](https://link.springer.com/referenceworkentry/10.1007/978-1-4419-5906-5_246). If you don't understand any of this (I don't), then here is an [easy to understand video from Computerphile](https://www.youtube.com/watch?v=NF1pwjL9-DE).
  - [Elliptic-curve Diffie-Hellman (ECDH)](https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman): ECDH is just the Diffie-Hellman key exchange, but with elliptic curves. When the implementation mentions DH, ECDH is meant, since I'm going to use elliptic curves for everything anyway. Here, it's going to be used as part of the X3DH algorithm to perform the DH key exchanges.
  - [Elliptic Curve Digital Signature Algorithm (ECDSA)](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm): ECDSA is - similar to ECDH - a variant of the [Digital Signature Algorithm (DSA)](https://en.wikipedia.org/wiki/Digital_Signature_Algorithm), using ellipctic curves. DSA is used to [digitally sign](https://en.wikipedia.org/wiki/Digital_signature) arbitary data using public and private keys ([asymmetric cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography)). I'm going to use it for the X3DH algorithm.
- [Hashing](https://en.wikipedia.org/wiki/Hash_function): Hashing is the process of turning any arbitary data into a fixed-length block. The length is defined by the hash algorithm, and is usually 256 bits (32 bytes). Hashes are mainly used for verifying data integrity, since even the slightest change (for example, replace a dot with a comma) has drastic impacts on the derived hash.
- [AES (sometimes called Rijndael)](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard): AES (Advanced Encryption Standard) is probably the most widely used [symmetric-key encryption algorithm](https://en.wikipedia.org/wiki/Symmetric-key_algorithm) (this means that the same key decrypts and encrypts the data, unlike in [RSA](<https://en.wikipedia.org/wiki/RSA_(cryptosystem)>) for example). It's a variant of the Rijndael algorithm and works with a fixed key size of 128, 192 or 256 bits (16, 24 and 32 bytes respectively) and processes 128 bits (16 bytes) of data at a time, this is also called the block size. I'll use its variant called [AES-GCM](https://en.wikipedia.org/wiki/AES-GCM-SIV) with a 256 bits long key for the actual (en/de)cryption.
- [MAC](https://en.wikipedia.org/wiki/Message_authentication_code): MAC stands for message authentication code and is used for ensuring authenticity and integrity. It's similar to a digital signature, but uses a single key instead of a keypair. To verify a MAC signature, you need the key used to generate it. The term MAC is rather generic, meanwhile [HMAC](https://en.wikipedia.org/wiki/HMAC) is a specific MAC implementation using a hash function.
- [HKDF](https://en.wikipedia.org/wiki/HKDF): HKDF is a [key derivation function](https://en.wikipedia.org/wiki/Key_derivation_function) which takes in some parameters and returns a cryptographically secure key - other examples are [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) and [Argon2](https://en.wikipedia.org/wiki/Argon2) - with some HMAC sprinkled on top of it, to ensure integry and authenticity. It's going to be the main function I'll use for the Double Ratchet implementation, since it is essentially a ratchet function.
- [Forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy): Forward secrecy (sometimes called perfect forward secrecy) means that when a secret is revealed, it cannot be used to crack previous sessions or messages for example. Let's say I use a single key to encrypt all of my messages. In that case, if an attacker cracks the key once, they get access to all past and future messages.
- [Future secrecy (or backward secrecy)](https://users.ece.cmu.edu/~adrian/projects/sec/node6.html): future secrecy is the opposite of forward secrecy: when a secret is compromised, it cannot be used to crack future sessions. The previous example with the single key had no forward or future secrecy. If the key was replaced a ratchet function that uses key derivation functions to always generate new keys based on a starting key, cracking one key would mean you cannot crack previous keys, but it would still not have future secrecy, since you could input the compromised key into the ratchet and it'll generate all the future keys for you.

## Main concepts for E2EE

E2EE is basically made up of two parts: key exchange and encryption algorithm. For an E2EE algorithm to be secure, both parts must be robust and secure. A house with a super complicated, top-of-the-line security system, but with the deactivation key just being a simple button you need to press, wouldn't be too secure, right?

So let's take a look at these two parts:

### Key exchange

Since all encryption algorithms need some sort of secret key (a key that's meant to be kept secret and only known to a very few selected people, sometimes just you), you need to share it with the recipient, so they can actually understand and read your messages. There are a lot of different types of key exchange, the most secure being meeting with the recipient in person and sharing the key that way. But alas, we're stuck on the Internet, so we'll have to figure out a way to share keys with each other while assuming that the entire world is listening to us and trying to break the communication.

Luckily, smart people have already figured out some pretty good ways of doing that (proof: the URL of this website starts with `https://`), two of which we're going to discuss and implement later: the [Diffie-Hellman key exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange), and Signal's [Extended Triple Diffie-Hellman](https://www.signal.org/docs/specifications/x3dh/) key agreement protocol (X3DH), which is a beast and my personal favourite.

### Encryption algorithm

Great, you've shared a random secret key with your recipient, time to encrypt messages! So let's just put that key into an AES algorithm, and we're don- **_NO!!!_**

See, AES is nice and all, but think about what happens if a hacker breaks the key: oops, they just got access to all past and future messages, my bad! This is where forward secrecy comes in handy.

To implement this, we can use "ratchet" functions. These functions work like a real [ratchet](<https://en.wikipedia.org/wiki/Ratchet_(device)>): they only go forward, but not backwards. If you think about hashing, you might recognise that it is also a ratchet function: you cannot revert a hash to get the original input data.

Alright, you've updated your app so it uses a ratchet function to generate a new key for each message, and this ratchet is synchronised on the recipient's and your devices (since otherwise they wouldn't be able to decrypt your messages). I think you can figure out the next problem: if hackers can't read past keys, can't they just use the ratchet to generate all future keys after compromising one? They can, you're absolutely correct. Solution: add another ratchet, 2 > 1!

I'm serious, an encryption algorithm we're going to cover in this post also comes from Signal, and it's called (wait for it...): [The Double Ratchet Algorithm](https://signal.org/docs/specifications/doubleratchet/). Yeah, the creators weren't exactly creative with the name, but it works. The idea is that there is a main ratchet used to generate the encryption keys, and another ratchet which frequently refreshes the encryption ratchets using a DH or X3DH key exchange (so it becomes completely randomised and unpredictable), which means even if an attacker breaks one of your keys, they can only see a few more messages (depending on the implementation) before the encryption ratchet is refreshed again.
After your double ratchet system has been set up, you can finally use the generated encryption keys with any cipher you want. For the implementation, we're always going to use 256-bit AES-GCM.

## Implementing DH, XD3H and Double Ratchet

We'll break up some of the implementations in multiple posts, otherwise it'd be way too long. For starters, we'll look at a simple DH key exchange and if you're interested, you can continue with the X3DH and Double Ratchet implementations.

### Environment setup

Before you start implementing anything, you need to set up your environment. I prefer using built-in browser APIs, but you may use any 3rd party library - provided it has the necessary features.

For anything cryptography related, I'm going to use the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). This API contains a bunch of useful cryptographical functions.

Unfortunately it has some caveats:

- Since it hasn't been approved yet as a [W3C standard](https://wicg.github.io/webcrypto-secure-curves/), safe curves e.g. [Curve25519](https://en.wikipedia.org/wiki/Curve25519) are not available. Why this matters will be explained below.
- Because of the lack of Curve25519, I'm going to use the [NIST P-256](https://neuromancer.sk/std/nist/P-256) curve instead. Yes, I know about its [controversies](https://miracl.com/blog/backdoors-in-nist-elliptic-curves/), but it's only for the purposes of showcasing, feel free to use any custom library with stronger curves for anything I'm about to do.

## Implementing a basic DH key exchange

### Generating the keypairs

For a DH key exchange to happen, we need 2 things: Alice's and Bob's keypair. We can then mix the recipient's public key with our private key and get a shared secret.

::: warning
Make sure the following code is served from a server with HTTPS, because the Web Crypto API only works in secure contexts! Otherwise you can run it in Node.js.
:::

```typescript
const crypto = globalThis.crypto.subtle;
```

We declare a variable called "crypto", and set it to [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) object of `globalThis`. SubtleCrypto is part of the Web Crypto API and has all the cool stuff we want. `globalThis` is used, to make sure the code can be executed in both the browser and Node.js.

```typescript
const alice = await crypto.generateKey(
	{ name: "ECDH", namedCurve: "P-256" },
	true,
	["deriveKey"],
);

const bob = await crypto.generateKey(
	{ name: "ECDH", namedCurve: "P-256" },
	true,
	["deriveKey"],
);
```

This should be pretty self explanatory: we create two variables named `alice` and `bob` using the [`SubtleCrypto.generateKey()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey) method with the required parameters:

1. The algorithm we want to use: (ECDH with the [P-256](https://neuromancer.sk/std/nist/P-256) curve),
2. If we'd like to export the key later. If we set it to false, [`SubtleCrypto.exportKey()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey) will not work on the keys, so we cannot store them later, which is usually not what you'd want.
3. An array of key usages. `deriveKey` means that we'll use this keypair later to create a new key.

```typescript
function toHex(buffer: ArrayBufferLike) {
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

console.log(
	`Alice's private key: ${toHex(await crypto.exportKey("pkcs8", alice.privateKey))}, public key: ${toHex(
		await crypto.exportKey("raw", alice.publicKey),
	)}`,
);
console.log(
	`Bob's private key: ${toHex(await crypto.exportKey("pkcs8", bob.privateKey))}, public key: ${toHex(
		await crypto.exportKey("raw", bob.publicKey),
	)}`,
);
```

This is a bit more complicated. First, we define a new function called `toHex`, which takes in an [`ArrayBufferLike`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) object and turns it into its hex representation. (ArrayBufferLike is the `ArrayBuffer` and `SharedArrayBuffer` types combined). We need this because right after it we're going to display the generated keys using [`SubtleCrypto.exportKey()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey), which returns an `ArrayBuffer` object that we cannot just `console.log()`. So we first define a utility function that makes the keys human-readable. And then we actually export the keys and display them to the console. Notice how with private keys the type is set to `pkcs8`, while public keys use `raw`. This is just a [quirk of SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#supported_formats), you cannot use the raw format on private keys and the pkcs8 format on public and AES secret keys.

### Deriving the secret key

Time to do a DH key exchange!

```typescript
const aliceSecret = await crypto.deriveKey(
	{ name: "ECDH", public: bob.publicKey },
	alice.privateKey,
	{ name: "AES-GCM", length: 256 },
	true,
	["encrypt", "decrypt"],
);

const bobSecret = await crypto.deriveKey(
	{ name: "ECDH", public: alice.publicKey },
	bob.privateKey,
	{ name: "AES-GCM", length: 256 },
	true,
	["encrypt", "decrypt"],
);
```

Because we've previously set the key usage to `deriveKey`, we can use [`SubtleCrypto.deriveKey()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey) on the keypairs. First we define the algorithm, in this case `ECDH` with the public component, our private key, the type of key we want to generate (we'll use 256 bits long AES-GCM), and finally the already known export and key usage values. `encrypt` and `decrypt` mean exactly what you think: only keys with these usages are accepted in [`SubtleCrypto.encrypt()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt) and [`SubtleCrypto.decrypt()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt). Notice how Alice uses Bob's public key and her private key, while Bob does the exact opposite. If all turns out fine, we should get the same exact keys, so let's check!

```typescript
console.log("Derived shared secrets!");

console.log(
	`Alice's secret: ${toHex(await crypto.exportKey("raw", aliceSecret))}`,
);
console.log(`Bob's secret: ${toHex(await crypto.exportKey("raw", bobSecret))}`);
```

`SubtleCrypto.exportKey()` - as the name suggests - turns a `CryptoKey` object into a format that we can then read/write, because you cannot just read a `CryptoKey` object (if you put it into `console.log()` it'd only tell you the key usages, if it's a secret or part of a keypair, the algorithm used to generate the key and if it's extractable). Let's see the console output!

```
Generated keypairs!
Alice's private key: 308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b0201010420635b42d1d8c4dd3dead643b50e6fe56bfbab071370c4e02c27b81b5273041439a1440342000428f4a66b3d11b597ff2ba2b0ec33fe87074e416e796b02579b474b455781b930f3879f637859e963de79c2fff5995568abd1dc92f4d09a8b5ead67a2f48d6307, public key: 0428f4a66b3d11b597ff2ba2b0ec33fe87074e416e796b02579b474b455781b930f3879f637859e963de79c2fff5995568abd1dc92f4d09a8b5ead67a2f48d6307
Bob's private key: 308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b02010104201949cd99096254b9d90bd23aac8f4dde59c8a30253f7ba0f722fcc0cab797094a144034200047a16f4a6a7da34b387bd3c337fb7f1df40751f5df95184144a0e5f63fc62e313dc6d0d8e25602a9d224a7b208258c20b7085018ff12b0876972ff043d5bbfb85, public key: 047a16f4a6a7da34b387bd3c337fb7f1df40751f5df95184144a0e5f63fc62e313dc6d0d8e25602a9d224a7b208258c20b7085018ff12b0876972ff043d5bbfb85
Derived shared secrets!
Alice's secret: a49977f16b7ca79faedb98eac5abebabed687da2ccc4a27e63480afefb213a4c
Bob's secret: a49977f16b7ca79faedb98eac5abebabed687da2ccc4a27e63480afefb213a4c
```

They match, which means we've done a great job! We could now theoretically use this key to perform symmetric AES encryption, but I've already explained why a single key is a bad idea, so let's not do that yet.

### Actually, a little testing never hurts...

For the third time, do not **ever** use a single key for encryption, but just to see how it works in `SubtleCrypto`, I'll show you how to use the generated secret from earlier to encrypt a simple "Hello World" message.

Since you've already set up the final secret keys with the `encrypt` and `decrypt` key usages, you just need to provide the [IV (initialization vector)](https://en.wikipedia.org/wiki/Initialization_vector) and the data to encrypt.

::: note
The initialization vector should be completely random every time you encrypt something. You also need to transmit it to the recipient, but it does not need to be kept secret.
:::

```typescript
const data = new TextEncoder().encode("Hello, world!");

const iv = window.crypto.getRandomValues(new Uint8Array(16));
const encrypted = await crypto.encrypt(
	{ name: "AES-GCM", iv },
	aliceSecret,
	data,
);

console.log(`Encrypted data: ${toHex(encrypted)}`);
```

The [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) class is used to convert the [`UTF-8`](https://en.wikipedia.org/wiki/UTF-8) string into a [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array). Then we define `iv` using the [`Crypto.getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) function, which does pretty much what it says: you give it a [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) object - a `Uint8Array` in this case - and it fills up every byte with a [random value](https://en.wikipedia.org/wiki/Random_number_generation). It is not a truly random number generator (TRNG), but a pseudorandom number generator (PRNG) with high enough entropy that is suitable for cryptographic purposes.

After the initial setup, you can run [`SubtleCrypto.encrypt()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt), with the specified algorithm, in this case `AES-GCM` which also needs the IV, the key to encrypt with and the actual data. This method returns an `ArrayBuffer`, which is then hexified and logged to the console.

Let's see the result (it's going to be completely different for you)!

```
Encrypted data: 30c4c584523b6da399aec32504ff607d7e39f35b5e416383f270383bc9
```

Now let's do the very opposite:

```typescript
const decrypted = await crypto.decrypt(
	{ name: "AES-GCM", iv },
	aliceSecret,
	encrypted,
);

console.log(`Decrypted data: ${new TextDecoder().decode(decrypted)}`);
```

As mentioned previously, AES uses the same key for en- and decryption, so you'll need to use `aliceSecret` (or `bobSecret`, since we know they're the same) again. [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder) is just the opposite of `TextEncoder`: it turns any buffer source (in this case an `ArrayBuffer`) into `UTF-8`.

Result:

```
Decrypted data: Hello, world!
```

Congratulations, you just learned how to perform a basic DH key exchange between two parties and use the derived secret to encrypt some data.

Download the entire code for this example <a href="/files/double-ratchet.ts" download="double-ratchet.ts">here</a>.

### Hold up, wait a minute...

If you look really closely at this code, and I mean extremely closely, you might realise something: these keypairs are generated locally on the same exact device, in the same JS script. Obviously that makes no sense for an E2EE app, and you're right, you're supposed to transmit the public keys via the Internet, which raises a problem: how can I make sure the server is not changing the public keys?

If you've ever used a platform like Matrix or Signal, you might have noticed that both have a verification system (Matrix uses emojis, Signal uses "safety numbers"). The verification panel also says that you're supposed to verify via a safe channel (so basically not the same app you want to verify in) that the same exact emojis/numbers are shown on both devices. This verification solves the problem described earlier: it verifies that the server is not trying to perform an [MITM](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attack. Matrix uses [SAS (Short Authentication String)](https://matrix.org/docs/guides/implementing-more-advanced-e-2-ee-features-such-as-cross-signing#1-implement-emoji-verification-sas), which performs a DH key exchange described above, applies HKDF to the derived secret and converts the result into an emoji or number. That way, if the emojis don't match on both devices, you know that the server has **modified** at least one of the public keys during transit. The secret is then authenticated with MAC, verified on both devices and the process ends. Signal on the other hand just generates a [safety number](https://signal.org/blog/safety-number-updates/) using your and the recipient's public key. The idea is the same: if the numbers don't match on both devices, the server is doing shady stuff.

## What's next?

Now that you've learned how to perform a basic DH key exchange, I have another post for you which talks about the X3DH key agreement protocol, which is a lot more complicated, but also a lot more secure. You can find it [here](/tech/inside-e2ee/x3dh).

If that wasn't enough, I also have a post about the Double Ratchet algorithm, which is the final boss of E2EE. You can find it [here](/tech/inside-e2ee/double-ratchet).

Finally, Appendix A is about storing private data safely, so you can keep using them after closing your browser. You can find it [here](/tech/inside-e2ee/appendix-a).

## Final thoughts

This thing is complicated.

## Coming soon

1. Matrix's Megolm algorithm for group communication
2. Signal's Sesame algorithm for managing sessions between multiple devices
3. Examples for post-quantum cryptography

Have a nice day!
