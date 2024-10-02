---
title: "Part 3: The Double Ratchet Algorithm"
description: A great way of encrypting messages between two parties.
date: 2023-11-29
author: Mester
series: 3
---

## Implementing Double Ratchet for 1-on-1 communication (final boss, beware!)

You've finally reached this. Well, this is the point of no return, if you decide to continue, you can never go back.

With that out of the way, let's do this! :)

### Creating a single ratchet

Obviously if you want to have a _double_ ratchet, you'll logically need a _single_ ratchet first.

There are actually a lot of different ways to create a ratchet. After all, it really just needs a function that can "turn" one way, but never in the other. We will use HKDF, a type of key derivation function supercharged by HMAC.

This single ratchet will take in 32 random bytes as its first state, and provide a function to perform a turn. When the ratchet is turned, the ratchet's state is fed into the HKDF algorithm with some constants and we get a new key. We split this key in half, the first part is going to be the new state and the second half is what we actually use for message encryption/decryption - essentially the output of the turn function. This is also called a symmetric ratchet, because it just keeps feeding a state into itself, there are no other parameters that would change the output. Later we'll create a DH ratchet which will no longer be symmetric, since it uses a combination of different inputs.

```typescript
const crypto = globalThis.crypto.subtle;

// global hkdf info constant, can be anything
const hkdfInfo = new TextEncoder().encode("Created by Mester");

function toHex(buffer: ArrayBufferLike) {
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
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
		const state = await crypto.importKey("raw", this.#state, "HKDF", false, [
			"deriveBits",
		]);

		// create a new state, the salt is just an empty array
		const newState = await crypto.deriveBits(
			{ name: "HKDF", hash: "SHA-512", salt: new Uint8Array(), info: hkdfInfo },
			state,
			64 * 8,
		);

		// set the state to the first 32 bytes
		this.#state = new Uint8Array(newState, 0, 32);

		// return the last 32 bytes (used for message encryption/decryption)
		return new Uint8Array(newState, 32, 32);
	}
}
```

::: warning Protected members and their weakness
The # symbol in #state is a naming convention that marks a property or method "protected" and inaccessable outside the class. However, this does NOT mean it's completely safe from potential attacks. You must not rely solely on this to protect private data such as ratchet states, keychains etc.
:::

There is a lot to unpack here (fortunately the comments help explain a lot).

We define a global `hkdfInfo` variable, this is a constant used for the HKDF algorithm (it was already used once in the X3DH protocol). Then, a class called `SymRatchet` is created, this will serve as our symmetric ratchet. It has a constructor which just sets the private state to the initial `Uint8Array` seed its given.

The `turn` function does multiple things:

1. We import the state as a `CryptoKey`, which is marked to be used in the `HKDF` algorithm for deriving bits.
2. We run the state through the HDKF function, with the salt being an empty `Uint8Array`. If a random salt was given for every turn, it'd get out of sync with our chat partner, since they don't know this random salt we generated.
3. The state key is then used to derive 64 bytes (512 bits) using HKDF. The `SHA-512` hash algorithm is used, because it generates a 64 bytes hash, therefore it's the most compatible with our ratchet.
4. The first 32 bytes become the state key and we return the rest.

Because only the first 32 bytes are used to perform a next turn, the data the `turn` function returns (also called the message key) can be stored, since it cannot be used to break into the ratchet.

To test if it works, let's set up two ratchets, but with different starting seeds.

#### Example 1

```typescript
const ratchet = new SymRatchet(
	new Uint8Array([
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
	]),
);
for (let i = 0; i < 5; i++) console.log(toHex(await ratchet.turn()));
```

Output:

```
e67b48f096bdebb50e0ae6ea1e37c9ec128bbc37424d27a87f3ef3697d00b1b6
38c1319aa2caca2f17000f99129ad98c44ac82fcc9402a817e790d06757c7e1f
3448baae021ed6066f3592c531101c31bf251ff1a11689f92dc38cb5fbc29137
ba98c268b3518dddb107d080f6e98963b71d28c1191ae6fbc7e21ebcd2b6bccc
685fe809a71a210a18bb01347607d639b747a742736ecd62bad7d1eeab22c2a0
```

#### Example 2

```typescript
const ratchet = new SymRatchet(
	new Uint8Array([
		1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
	]),
);
for (let i = 0; i < 5; i++) console.log(toHex(await ratchet.turn()));
```

Output:

```
20798bf7dec3d096dcac43eec9673b500126c5a10cc86efd26196a4ff4c5a4a0
ac46b9da114b5ebf4eeb859d63fa0d4d69eee3a5c535adfa8c26969a3b3ea6fd
67a4c91239e5677dc04bfd52fdc75eb3114fc2e896f128fee25026996251a2d2
46cce5a3ff4da3a895af6a1cd57ae8708b32579c4c3cf645f5ad12f3f66e4024
9d7f3788798a4601338885cc063a6b2207759f8346dffd611d311f0e1224ecab
```

As you can see, a relatively minor change of the seed (simply making the first byte 1 instead of 0) had huge impacts on the output keys. Yay, encryption!

### Creating the double ratchet

Great, now let's put two of these together to create a double ratchet. But wait... how exactly do we use these message keys?

Basically, we need to somehow create ratchets for Alice and Bob that are synchronised with each other (= their seed are the same). That way, if Alice encrypts a message, Bob will be able to read it, because he can generate the same exact key Alice used to encrypt a message. So both of them will get a sending and receiving ratchet: Alice's sending ratchet is the same as Bob's receiving ratchet and vice versa. So sending a message would look like this:

1. Alice turns her sending ratchet, uses key to encrypt message.
2. Sends message to Bob.
3. Bob turns his receiving ratchet, uses key to decrypt message.
4. Party 🎉

To manage these ratchets, Alice and Bob will both create a root ratchet using a shared secret key (which can come from the previously implemented X3DH protocol). The output of the root ratchets will then be used to create the sending and receiving ratchets.

There is something important to remember: if Alice and Bob create their root ratchets using the same seed (which will produce the same keys!) and turn them once to create their sending ratchets, then the sending ratchets will be synchronised, which is not what we want - we want the send-receive pairs to be synchronised. This means, there has to be a system that decides who should use their root ratchet's first turn as their sending ratchet and who should use it as their receiving ratchet. For now, we'll simply use a boolean called `firstSend` to decide this, but later we'll use a more sophisticated system.

```typescript
/**
 * A double ratchet that can encrypt and decrypt messages.
 */
class DoubleRatchet {
	#root: SymRatchet;
	#send: SymRatchet | undefined;
	#receive: SymRatchet | undefined;

	firstSend: boolean = true;

	constructor(seed: Uint8Array, firstSend: boolean = true) {
		this.#root = new SymRatchet(seed);

		this.firstSend = firstSend;
	}

	async #init() {
		if (this.firstSend) {
			this.#send = new SymRatchet(await this.#root.turn());
			this.#receive = new SymRatchet(await this.#root.turn());
		} else {
			this.#receive = new SymRatchet(await this.#root.turn());
			this.#send = new SymRatchet(await this.#root.turn());
		}
	}

	async encrypt(message: Uint8Array) {
		if (!this.#send) throw new Error("DoubleRatchet not initialized");

		// generate random IV
		const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));

		// turn the sending ratchet to create a message key
		const messageKey = await crypto.importKey(
			"raw",
			await this.#send.turn(),
			{ name: "AES-GCM" },
			false,
			["encrypt"],
		);
		const ciphertext = new Uint8Array(
			await crypto.encrypt({ name: "AES-GCM", iv }, messageKey, message),
		);

		return { iv, ciphertext };
	}

	async decrypt(ciphertext: Uint8Array, iv: Uint8Array) {
		if (!this.#receive) throw new Error("DoubleRatchet not initialized");

		// turn the receiving ratchet to create a message key
		const messageKey = await crypto.importKey(
			"raw",
			await this.#receive.turn(),
			{ name: "AES-GCM" },
			false,
			["decrypt"],
		);
		return crypto
			.decrypt({ name: "AES-GCM", iv }, messageKey, ciphertext)
			.then((pt) => new Uint8Array(pt));
	}

	static async build(seed: Uint8Array, firstSend: boolean = true) {
		const dr = new DoubleRatchet(seed, firstSend);
		await dr.#init();
		return dr;
	}
}
```

That's basically it, the only thing missing is the turning mechanism - we'll add that later. For now, let's see what we have here:

- The `#init` function of the `DoubleRatchet` class is used to create the sending and receiving ratchets (the order is based on the previously mentioned `firstSend` boolean).
- `encrypt` takes in some bytes, generates a 12 bytes initialization vector and encrypts it with the message key from the sending ratchet.
- `decrypt` does this in reverse, and turns the receiving ratchet instead.
- We also have a static `build` function, which is a simple wrapper around the constructor and `#init` function.

Now let's see if we can use it to send some messages between Alice and Bob! To make the secret sharing simpler, we'll just generate a random secret on the fly instead of using the X3DH code from earlier.

```typescript
const secret = globalThis.crypto.getRandomValues(new Uint8Array(32));

const alice = await DoubleRatchet.build(secret, true);
const bob = await DoubleRatchet.build(secret, false);

const message1 = new TextEncoder().encode("Hello, Bob!");
const { iv: iv1, ciphertext: ciphertext1 } = await alice.encrypt(message1);

console.log("Alice sends:", toHex(iv1), toHex(ciphertext1));

const decrypted1 = await bob.decrypt(ciphertext1, iv1);

console.log("Bob received:", new TextDecoder().decode(decrypted1));

const message2 = new TextEncoder().encode("Hello, Alice!");
const { iv: iv2, ciphertext: ciphertext2 } = await bob.encrypt(message2);

console.log("Bob sends:", toHex(iv2), toHex(ciphertext2));

const decrypted2 = await alice.decrypt(ciphertext2, iv2);

console.log("Alice received:", new TextDecoder().decode(decrypted2));
```

Output (will be different every time you run the script, since the secret is random):

```
Alice sends: ccd3341549bc92565d15d811 415b350824d0d93acf134341903bddb6271ef25b42aa3d722c125b
Bob received: Hello, Bob!
Bob sends: a9eb63fdd2e06a09a5399b7e db7929a69b4b67ac9c23c236eafddb2b9035a0a03a35bf3f4da6e734a5
Alice received: Hello, Alice!
```

### Updating the double ratchet

If you've read everything in this post carefully, you might realise something: the ratchets as of right now don't provide future secrecy. Sure, the message keys cannot be used to break in, but what if someone cracks a ratchet state key? Then the attacker can (and probably will) use that state key to get all future keys. Fortunately they cannot go backwards, but even if a 2 days-old key is cracked, all the messages that are younger than 2 days are cracked too, and that is bad - don't forget the attacker can just keep turning his own compromised ratchet, so it might take you months or years to figure out you've been spied on all the time.

To fix that, we'll use the root ratchets to generate new sending and receiving ratchets after a certain limit has passed (the most secure option is after every single message). However, this doesn't solve the problem yet, since the root ratchet is just a symmetric ratchet which has the same exact problems as the sending and receiving ratchets. So to truly make it recover from break-in attacks, instead of turning it the "conventional" way, we'll just refresh it with completely new, random DH keys.

For that to work though, we'll need to change the code a little. We want the root ratchet to be a Diffie-Hellman ratchet, which will provide us future secrecy (and happiness). Under the hood, it'll act similarly to a symmetric ratchet, but instead of the salt being a single 0 byte, we'll use the output of DH key exchanges as the HKDF salt.

Hold up... so how does it work?

Let's say Alice wants to chat with Bob. She generates a DH keypair and sends a message request to Bob, which contains a random seed for the root ratchet and her public key. Now Alice needs to wait for a response from Bob. Until that happens, all messages she tries to send must be put into a queue (or discarded completely). When Bob sees the request, he generates his own DH keypair and turns his root ratchet: he calculates the DH output of his private key and Alice's public key to generate a DH output, which will be the salt inside a symmteric ratchet (this randomises the output, providing future secrecy). The output of the symmteric ratchet will be used as the seed for his sending ratchet. Now, Bob can send back his public key, and because he already has a sending ratchet, he can start sending messages to Alice, even if she's offline at the time.

When Alice sees Bob has accepted the message request and provided his own public key, she can do a root ratchet turn too: because we know Bob has used the public key of Alice's first DH keychain, Alice can use his private key and Bob's public key to generate the same DH output for her symmetric ratchet. This output will be used to create Alice's receiving ratchet which will be equal to Bob's sending ratchet (she can read Bob's messages that he sent earlier with it). She now needs a sending ratchet, so she generates a new DH keychain (discarding the old one) and uses the same public key she got from Bob to generate her sending ratchet. Then she sends it to Bob.

Now, if Bob gets Alice's public key, the whole cycle repeats: Bob generates a receiving ratchet using his current private key and the provided public key and a sending ratchet with a new DH keypair, then sends his public key to Alice. It's important to note: **a party can only turn their root ratchet, if they have received a new public key from the other party**.

In other words, after Alice generates her receive and sending ratchet, she cannot generate a new sending ratchet again, because Bob has not yet received her public key and returned a new public key of his own. This is important to keep in mind, otherwise it could lead to desynchronization of the root ratchets. Also, every root ratchet turn follows the following steps:

1. Calculate a DH exchange, use the output in the symmetric turn to create the new receiving ratchet.
2. Generate a new DH keypair, discard the old one.
3. Calculate a DH exchange with the new keys, use the output in the symmetric turn to create the new sending ratchet.

The only exception is the initial setup (when Bob receives Alice's message request), where the first step is skipped.

::: note
Every message contains the party's public key (this will be used later for out-of-order messages), therefore the other party must decide if that key is new or not. You'll see how this might be implemented soon.
:::

If you didn't understand any of that, don't worry, me neither. I basically just turned the images [here](https://signal.org/docs/specifications/doubleratchet/#diffie-hellman-ratchet) to text.

But enough talk, let's code.

```typescript
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
		this.#keyChain = await crypto.generateKey(
			{ name: "ECDH", namedCurve: "P-256" },
			true,
			["deriveBits"],
		);
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
			this.#keyChain = await crypto.generateKey(
				{ name: "ECDH", namedCurve: "P-256" },
				true,
				["deriveBits"],
			);
		}

		// import the public key
		const publicKey = await crypto.importKey(
			"raw",
			pubkey,
			{ name: "ECDH", namedCurve: "P-256" },
			false,
			[],
		);

		// derive a new DH output
		const dhOutput = await crypto.deriveBits(
			{ name: "ECDH", public: publicKey },
			this.#keyChain.privateKey,
			32 * 8,
		);

		// use the DH output as the HKDF salt
		const state = await crypto.importKey(
			"raw",
			this.#state,
			{ name: "HKDF" },
			false,
			["deriveBits"],
		);
		const newState = await crypto.deriveBits(
			{ name: "HKDF", hash: "SHA-512", salt: dhOutput, info: hkdfInfo },
			state,
			64 * 8,
		);

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
```

That's basically it! We create a `DHRatchet` class which has a private `keyChain` and `state` property, a function to set up the keychain, a function to get the public component of the keychain and our `turn` function, which requires a public key and a boolean that tells it if it's time to generate a new key. The `turn` function is almost identical to the one in the symmetric ratchet, but instead of the salt just being an empty array, it's actually the DH output now. In practice, you'd also implement a function that could save the private key component, but it must be done securely. There is also a static `build` function to help us create a DH ratchet easier.

We also need to change how our `DoubleRatchet` class works, since the root ratchet is not a simple symmetric ratchet anymore.

```typescript
class DoubleRatchet {
    root: DHRatchet;

    ...

    // firstSend property removed

    constructor() {
        this.root = new DHRatchet();
    }

    // init function removed

    async turn(pubkey: Uint8Array) {
        // step 1: turn the root ratchet and use it for the receiving ratchet's seed
        const receiveSeed = await this.root.turn(pubkey);
        this.#receive = new SymRatchet(receiveSeed);

        // step 2: turn the root ratchet again - this time with a new key - and use it for the sending ratchet's seed
        const sendSeed = await this.root.turn(pubkey, true);
        this.#send = new SymRatchet(sendSeed);
    }

    ...

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
```

Let's look at the changes:

1. The `root` property is no longer private, since it has some methods that we'd like to access from outside the class. This fortunately doesn't compromise the security of the ratchet, since the state and keychain is still a private property.
2. firstSend has been removed.
3. The constructor doesn't need any arguments anymore and the root ratchet has been replaced by a DH ratchet.
4. Replacing the `init` function, a new `turn` function has been added, which performs a full root ratchet turn and creates new sending and receiving ratchets.
5. The `build` function now also accepts an optional initial public key and has been updated to set up the sending ratchet if it gets one. To use it, Alice will call `DoubleRatchet.build(secret)` and Bob will call `DoubleRatchet.build(secret, alicePubkey)`.

So can we use it? Sure!

#### Alice and Bob send 1 message after each other

```typescript
const seed = globalThis.crypto.getRandomValues(new Uint8Array(32));

// set up the double ratchet objects
const alice = await DoubleRatchet.build(seed);
const bob = await DoubleRatchet.build(seed, await alice.root.getPubkey());

// Bob informs Alice about his new public key, Alice turns her ratchet
await alice.turn(await bob.root.getPubkey());

// Alice and Bob send a single message after each other
const aliceMessage = await alice.encrypt(
	new TextEncoder().encode("Hello Bob!"),
);
console.log(
	"Alice's message:",
	toHex(aliceMessage.iv),
	toHex(aliceMessage.ciphertext),
);

// Bob receives Alice's message, turns his ratchet and decrypts the message
await bob.turn(await alice.root.getPubkey());

const aliceMessageDec = await bob.decrypt(
	aliceMessage.ciphertext,
	aliceMessage.iv,
);
console.log("Bob received:", new TextDecoder().decode(aliceMessageDec));

const bobMessage = await bob.encrypt(new TextEncoder().encode("Hello Alice!"));
console.log(
	"Bob's message:",
	toHex(bobMessage.iv),
	toHex(bobMessage.ciphertext),
);

// Alice receives Bob's message, turns her ratchet and decrypts the message
await alice.turn(await bob.root.getPubkey());
console.log(
	"Alice received:",
	new TextDecoder().decode(
		await alice.decrypt(bobMessage.ciphertext, bobMessage.iv),
	),
);
```

Output:

```
Alice's message: 11d616f57c55d6f6de5d7247 4e12cc2908b3826584e49c948fade4b53f08f51addb6b8ea1547
Bob received: Hello Bob!
Bob's message: 3421685842620804ce8f3024 3db62dda1b679fd055f27a2bfc523111b27c779ae791f1a0a17b6804
Alice received: Hello Alice!
```

You might have noticed that we need to turn the ratchet before we can decrypt a message. This is because the ratchet is not turned automatically yet, we'll add that later.

#### Alice sends 2 messages

In the previous example, Alice and Bob both sent one message after each other, but that's not usually what happens in an online chat. Let's see what happens when Alice wants to send 2 messages.

```typescript
... // ratchet setup same as before

// Bob is offline

// Alice sends a message to Bob
const message1 = await alice.encrypt(new TextEncoder().encode("Hello Bob, this is message 1!"));
const { iv: iv1, ciphertext: ciphertext1 } = message1;
console.log("Message 1:", toHex(iv1), toHex(ciphertext1));

// Alice cannot generate a new sending ratchet yet, we must wait for Bob to respond

const message2 = await alice.encrypt(new TextEncoder().encode("Hello Bob, this is message 2!"));
const { iv: iv2, ciphertext: ciphertext2 } = message2;
console.log("Message 2:", toHex(iv2), toHex(ciphertext2));

// Bob is online again, he turns his ratchet
await bob.turn(await alice.root.getPubkey());

const decrypted1 = await bob.decrypt(ciphertext1, iv1);
console.log("Bob receives:", new TextDecoder().decode(decrypted1));
const decrypted2 = await bob.decrypt(ciphertext2, iv2);
console.log("Bob receives:", new TextDecoder().decode(decrypted2));
```

Output:

```
Message 1: ba62e4596c9fd951a241a519 db8fe04ea26d7bf6883496613eef636b70dc04575b02f7b6663334f91e36c90171242c3cc4e58359e824f87685
Message 2: fe5df85d8f75f2b7d2d47d9b 71f5ad31807d0dce2694a2a60499a4393ed8b9e7ce75539bbb9b8381f1dcf65f4a4bcf6d3c0b2e9fd15c062cad
Bob receives: Hello Bob, this is message 1!
Bob receives: Hello Bob, this is message 2!
```

Because Alice has already used Bob's public key for turning her root ratchet, she cannot do that again with the same public key, therefore Alice must wait until Bob sends her his new public key. But that's no problem, because Alice can just turn her sending ratchet to encrypt another message, and when Bob receives both messages, he turns his root ratchet to generate a new receiving ratchet and can then decrypt both messages.

#### Bob sends a message first

In our examples, Alice was always the first to send a message, but obviously that might not always be the case. The code still works of course if Bob sends a message first, it's even simpler in that case!

```typescript
const seed = globalThis.crypto.getRandomValues(new Uint8Array(32));

// set up the double ratchet objects
const alice = await DoubleRatchet.build(seed);
const bob = await DoubleRatchet.build(seed, await alice.root.getPubkey());

// Bob sends Alice a message
const message1 = new TextEncoder().encode("Hello Alice!");
const { iv: iv1, ciphertext: ciphertext1 } = await bob.encrypt(message1);

// Alice receives the message, turns root ratchet
await alice.turn(await bob.root.getPubkey());

const message1Dec = await alice.decrypt(ciphertext1, iv1);
console.log(`Alice receives 1: ${new TextDecoder().decode(message1Dec)}`);

// Alice sends a message
const message2 = new TextEncoder().encode("Hello Bob!");
const { iv: iv2, ciphertext: ciphertext2 } = await alice.encrypt(message2);

// Bob receives the message, turns root ratchet
await bob.turn(await alice.root.getPubkey());

const message2Dec = await bob.decrypt(ciphertext2, iv2);
console.log(`Bob receives: ${new TextDecoder().decode(message2Dec)}`);
```

Output:

```
Alice receives: Hello Alice!
Bob receives: Hello Bob!
```

You might have noticed that in our previous examples, there was always a line that said "Bob informs Alice about his new public key", now why is that? If you remember how the DH ratchet turns, you might realise that after the initial setup, Bob has his sending ratchet, but Alice doesn't have any ratchets yet. If Alice wants to send a message, she first needs to learn Bob's public key. Usually what happens is Bob (the only person who can send messages at the time) automatically sends Alice a dummy message, which contains his public key. Alice can then turn her root ratchet and start sending messages too. This process depends on the protocol the application uses and is completely transparent to the user, but it's usually something like this.

### Ratchet recap

Let's quickly recap all these ratchets we're using before we continue, because it can get confusing.

- Sending and receiving ratchets: they're both symmetric ratchets (they feed their own state into themselves), the sending ratchet is used to encrypt messages and the receiving ratchet is used to decrypt messages.
- Root ratchet (DH ratchet): the root ratchet is at its core a symmetric ratchet, but it's seeded by a series of DH key exchanges (that's why it's called a DH ratchet). Its output is used to generate the starting seeds of the sending and receiving ratchets.

In this document, the terms DH ratchet and root ratchet are used interchangeably.

### Automated message processing

Our code works already, but it's a lot of manual work. To finish up the code, we'll make the message processing automatic, which will include decryption, DH ratchet turning etc. This will also allow us to fix something very common and annoying: internet problems.

#### Error correction + message headers

Imagine this situation: Alice sends 2 messages after each other really fast. Her internet is a bit unstable, and message 1 takes 2 seconds to reach Bob, but message 2 takes only 1 second. Bob has now got message 2 before message 1, he turns his receiving ratchet and... error. Because message 2 requires 2 turns, but Bob doesn't know that, he only turns his receiving ratchet once, which generates the key for message 1. Then, Bob receives message 1, turns his receiving ratchet and gets the key for message 2. Complete madness, which has its own name: out-of-order messages.

So how do we fix that?

For the sending and receiving ratchets, we track the number of messages that ratchet has processed (starting from 0), call it `N`. The first message will have a `N` of 0, the second message 1 etc. We'll also store the number of messages in the previous ratchet (the ratchet before a root turn), call it `PN`. This will also be transmitted with the message in a so called message header. Speaking of message headers, let's implement that too, so we can automate the root ratchet's turning.

```typescript
// utility interfaces
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
    header: Header;
}

/**
 * A double ratchet that can encrypt and decrypt messages.
 */
class DoubleRatchet {
    ...

    /**
     * Remote/receive key
     */
    #RK: string = "";

    /**
     * Message and previous message numbers for sending and receiving ratchets
     */
    #SN: number = 0;
    #RN: number = 0;
    #SPN: number = 0;
    #RPN: number = 0;

    ...

    async turn(pubkey: Uint8Array) {
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

    async encrypt(message: Uint8Array): Promise<MessageBundle> {
        if (!this.#send) throw new Error("DoubleRatchet not initialized");

        // generate random IV
        const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));

        // turn the sending ratchet to create a message key
        const messageKey = await crypto.importKey("raw", await this.#send.turn(), { name: "AES-GCM" }, false, ["encrypt"]);
        const ciphertext = new Uint8Array(await crypto.encrypt({ name: "AES-GCM", iv }, messageKey, message));

        const header: Header = {
            pubkey: await this.root.getPubkey(),
            N: this.#SN,
            PN: this.#SPN,
        };

        this.#SN++;

        return { rawMessage: { iv, ciphertext }, header };
    }

    async decrypt(rawMessage: RawMessage): Promise<ArrayBuffer> {
        if (!this.#receive) throw new Error("DoubleRatchet not initialized");

        const { iv, ciphertext } = rawMessage;

        // turn the receiving ratchet to create a message key
        const messageKey = await crypto.importKey("raw", await this.#receive.turn(), { name: "AES-GCM" }, false, ["decrypt"]);
        const message = new Uint8Array(await crypto.decrypt({ name: "AES-GCM", iv }, messageKey, ciphertext));

        this.#RN++;

        return message;
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
```

Let's take a look at the changes:

1. There are 3 new utility interfaces: `RawMessage`, `Header` and `MessageBundle`. `RawMessage` contains the ciphertext and the IV, `Header` contains the sender's public key, and the N and PN values of their sending ratchet.
2. The `DoubleRatchet` class has now got a bunch of new properties:
   - RK = Remote/receive key, it is the current public key of the other party, stored as its hex representation.
   - The N and PN values for both the send (SN, SPN) and receive (RN, RPN) ratchets.
3. The `setup` function is updated to change the RK value and reset the N and PN values.
4. The `encrypt` function now generates a message header and updates `SN` (note that it is updated after the sending ratchet has been turned!).
5. The `decrypt` function now accepts a `RawMessage` object and updates `RN`.

Using the double ratchet now doesn't change much, we still need to add the error correction mechanism.

```typescript
const seed = globalThis.crypto.getRandomValues(new Uint8Array(32));

const alice = await DoubleRatchet.build(seed);
const bob = await DoubleRatchet.build(seed, await alice.root.getPubkey());

// Bob sends a message to Alice
const message = await bob.encrypt(new TextEncoder().encode("Hello Alice!"));
console.dir(message);

// Alice receives the message, turns the ratchet and decrypts the message
await alice.turn(await bob.root.getPubkey());
const decrypted = await alice.decrypt(message.rawMessage);

console.log(`Decrypted message: ${new TextDecoder().decode(decrypted)}`);
```

Output

```
{
  rawMessage: {
    iv: Uint8Array(12) [ 112, 159, 115, 15, 254, 53, 131, 159, 1, 139, 195, 167 ],
    ciphertext: Uint8Array(28) [ 137, 35, 241, 31, 120, 62, 125, 220, 122, 177, 78, 73, 153, 128, 18, 182, 18, 101, 93, 16, 185, 96, 163, 16, 228, 173, 133, 230 ]
  },
  header: {
    pubkey: Uint8Array(65) [ 4, 150, 108, 87, 46, 231, 181, 66, 51, 62, 15, 203, 7, 159, 187, 136, 250, 97, 15, 211, 253, 180, 168, 161, 148, 178, 43, 29, 32, 140, 20, 41, 16, 142, 44, 219, 88, 225, 237, 31, 25, 141, 122, 20, 184, 169, 151, 26, 133, 229, 238, 194, 155, 127, 133, 64, 22, 212, 77, 233, 176, 110, 1, 232, 238 ],
    N: 0,
    PN: 0
  }
}
Decrypted message: Hello Alice!
```

#### Putting everything together

Let's take a look at how we can use these N and PN parameters. Let's say Bob sends us 4 messages, message 1 arrives correctly, but message 2 and 3 get skipped and we only get message 4. If we take a look at the headers, this is what we should see: message 1 has a `N` of 0, but message 4 has a `N` of 3. Don't forget that every time we receive a message, we also increase `RN` by one. So when receiving message 4, Alice's `RN` is 1. Based on Signal's document, there are 2 possible options here:

1. The message comes from the current ratchet: when Alice gets message 1, she stores the public key attached to it as her `RK` value. Message 4 will have the same public key, so Alice calculates `N` - `RN` = 3 - 1 = 2, which is going to be the count of skipped messages. This is true: we've skipped 2 messages: message 2 and 3.
2. The message comes from an older ratchet: this is a bit trickier. Imagine Bob sends message 1 and message 2, but message 2 is delayed. We send back message 3 which triggers a root ratchet turn for Bob. He sends message 4, which would trigger a root turn for us. Before a root turn actually happens, we must calculate if we're missing any messages. Our `RN` value is 1 (we've decrypted 1 message - message 1 - so far). Message 4's header will have a `N` of 0 (it's the 1st message in Bob's new send rathcet) and a `PN` of 2 (= Bob's previous sending ratchet had 2 messages, message 1 and 2). In this case, the count of messages skipped _in Bob's previous sending ratchet_ = `PN` - `RN` = 2 - 1 = 1. This is true, we have skipped 1 message in Bob's previous ratchet. The count of messages skipped _in Bob's new sending ratchet_ = `N` = 0. This is true, we've not skipped any messages in the current ratchet.

When we know we've skipped a message, we'll generate the message keys for it and store them in a list. This list will use the public key and `N` variable of the message to uniquely identify it. When the skipped message arrives, we'll use the stored key to decrypt it.

When we receive any message, the following happens:

1. We look at the list of skipped message keys, mapped by the message's public key and `N` value. If a corresponding message key was found, we use that to decrypt the message, then delete that key.
2. We calculate if we've skipped any messages in the previous ratchet. We turn our receiving ratchet that many times and store all keys in our list (we know that those messages will have our stored `RK` as the public key).
3. If needed, we turn our root ratchet. (this is where our `RK`, `N` and `PN` values get reset)
4. We calculate if we've skipped any messages in the current ratchet. We store the message keys just like before.
5. We decrypt and return the message.

I'm super excited, so let's do it!

```typescript
class DoubleRatchet {
    ...

    #skippedKeys = new Array<{ pubkey: string, N: number, key: Uint8Array }>();

    async #turn(pubkey: Uint8Array) {
        ...
    }

    ...

    async #decrypt(rawMessage: RawMessage, messageKey: CryptoKey) {
        const { iv, ciphertext } = rawMessage;

        // decrypt the message
        return crypto.decrypt({ name: "AES-GCM", iv }, messageKey, ciphertext).then(pt => new Uint8Array(pt));
    }

    async processMessage(message: MessageBundle) {
        // check if we already have a key for this message
        const skippedKey = this.#skippedKeys.find(k => k.pubkey === toHex(message.header.pubkey) && k.N === message.header.N);
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

    ...
}
```

::: note
The bunch of ! operators are there because I'm using strict null checks in TypeScript. You may remove them if you don't use that option.
:::

Functions `decrypt` and `turn` have become private and `decrypt` no longer turns the receiving ratchet manually, it requires the correct message key. The `processMessage` function is basically just what the pseudocode says, but as actual code. Note that `RN` has to be set to the message's `N` value + 1 (it's basically `RN` = `N` -> decrypt -> `RN++` simplied). There is also a new `skippedKeys` property which is an array that holds all the skipped keys.

::: note
You might have noticed there are these offset values. They're very important, otherwise we'd store message keys for the wrong messages. Imagine we got message 1 and 2 from the previous ratchet, but skipped 3, 4 and 5. If we didn't use the offset, we'd store message keys for messages with N of 0, 1 and 2 - message 1, 2 and 3. But we've already received message 1 and 2 (N = 0 and 1), therefore we need to store keys for message 3, 4 and 5. The offset is the number of messages we've already decrypted, we can use that to calculate the correct message number. The same logic applies for skipped messages in the current ratchet.
:::

#### Basic example

Sending messages now becomes stupidly simple.

```typescript
const seed = globalThis.crypto.getRandomValues(new Uint8Array(32));

const alice = await DoubleRatchet.build(seed);
const bob = await DoubleRatchet.build(seed, await alice.root.getPubkey());

// Bob sends a message
const message1 = await bob.encrypt(new TextEncoder().encode("Hello Alice!"));
console.dir(message1);

// Alice receives the message
const plaintext1 = await alice.processMessage(message1);
console.log("Decrypted message:", new TextDecoder().decode(plaintext1));
```

All the root turning and stuff we had to do previously is now compressed into a single function.

Output:

```
{
  rawMessage: {
    iv: Uint8Array(12) [ 152, 149, 99, 169, 122, 245, 89, 94, 100, 164, 100, 3 ],
    ciphertext: ArrayBuffer(28) [ 18, 79, 247, 158, 46, 245, 157, 196, 243, 102, 188, 109, 139, 89, 255, 44, 229, 141, 81, 241, 89, 232, 110, 110, 23, 45, 50, 195 ]
  },
  header: {
    pubkey: ArrayBuffer(65) [ 4, 91, 187, 115, 171, 98, 137, 209, 108, 62, 53, 30, 43, 107, 129, 116, 187, 112, 77, 52, 168, 210, 40, 73, 82, 54, 48, 184, 231, 143, 239, 111, 112, 243, 65, 39, 175, 132, 66, 250, 214, 11, 67, 230, 18, 160, 110, 1, 185, 143, 241, 163, 187, 44, 196, 24, 227, 225, 155, 202, 211, 188, 219, 83, 199 ],
    N: 0,
    PN: 0
  }
}
Decrypted message: Hello Alice!
```

#### Skipping messages

Now obviously, we've come this far to handle out-of-order messages. So let's do that! We will skip message 2 and 3 without a root turn.

```typescript
const seed = window.crypto.getRandomValues(new Uint8Array(32));

const alice = await DoubleRatchet.build(seed);
const bob = await DoubleRatchet.build(seed, await alice.root.getPubkey());

// Bob sends a message to Alice
const message1 = await bob.encrypt(
	new TextEncoder().encode("Hello Alice, this is message 1!"),
);
const message2 = await bob.encrypt(
	new TextEncoder().encode("Hello Alice, this is message 2!"),
);
const message3 = await bob.encrypt(
	new TextEncoder().encode("Hello Alice, this is message 3!"),
);
const message4 = await bob.encrypt(
	new TextEncoder().encode("Hello Alice, this is message 4!"),
);

// Message 1 arrives, but 2 and 3 are lost
const decrypted1 = await alice.processMessage(message1);
console.log("Alice receives:", new TextDecoder().decode(decrypted1));

// Message 4 arrives
const decrypted4 = await alice.processMessage(message4);
console.log("Alice receives:", new TextDecoder().decode(decrypted4));

// Message 2 and 3 arrive
const decrypted2 = await alice.processMessage(message2);
console.log("Alice receives:", new TextDecoder().decode(decrypted2));

const decrypted3 = await alice.processMessage(message3);
console.log("Alice receives:", new TextDecoder().decode(decrypted3));
```

Output:

```
Alice receives: Hello Alice, this is message 1!
Alice receives: Hello Alice, this is message 4!
Alice receives: Hello Alice, this is message 2!
Alice receives: Hello Alice, this is message 3!
```

Let's also test skipping messages in the previous chain!

```typescript
const seed = globalThis.crypto.getRandomValues(new Uint8Array(32));

const alice = await DoubleRatchet.build(seed);
const bob = await DoubleRatchet.build(seed, await alice.root.getPubkey());

// Bob sends message 1 and 2 to Alice
const message1 = await bob.encrypt(
	new TextEncoder().encode("This is message 1!"),
);
const message2 = await bob.encrypt(
	new TextEncoder().encode("This is message 2!"),
);

// message 1 arrives, 2 is delayed
const decrypted1 = await alice.processMessage(message1);
console.log("Alice receives:", new TextDecoder().decode(decrypted1));

// Alice sends message 3
const message3 = await alice.encrypt(
	new TextEncoder().encode("This is message 3!"),
);

const decrypted3 = await bob.processMessage(message3);
console.log("Bob receives:", new TextDecoder().decode(decrypted3));

// Bob sends message 4, message 2 also arrives
const message4 = await bob.encrypt(
	new TextEncoder().encode("This is message 4!"),
);

const decrypted4 = await alice.processMessage(message4);
console.log("Alice receives:", new TextDecoder().decode(decrypted4));
const decrypted2 = await alice.processMessage(message2);
console.log("Alice receives:", new TextDecoder().decode(decrypted2));
```

Output:

```
Alice receives: This is message 1!
Bob receives: This is message 3!
Alice receives: This is message 4!
Alice receives: This is message 2!
```

### Hiding those headers

So far we've only encrypted the actual message, while keeping the header in plaintext. This works fine, however some people might not like the idea of a server having full control over the header - remember, they can not only read it, but also modify it!

Fortunately for us, Signal has designed a method of encrypting headers inside Double Ratchet and it's surprisingly simple.

#### New keys on the horizon

To encrypt/decrypt headers, we'll need some kind of key. Alice and Bob will each have two keys for their sending and receiving ratchet, we'll call them header and next header key. The sending header key is used to encrypt a header and the receiving header key is to decrypt.

When Alice or Bob gets a message, they'll first try to decrypt the message header with their receiving header key. If that fails, they'll try the next receiving header key. If that succeeds, it means they have to do a DH ratchet turn. Otherwise, they'll look through their list of skipped messages and find the corressponding header key (we'll see how that works later).

The initialisation process is also a bit different. Let's say Alice wants to talk with Bob. Alongside a keypair and shared secret for the root ratchet, she'll also generate a sending header key and next receiving header key for Bob. Wait... what? You heard it right, Alice is the one who initialises Bob's header keys. This makes a lot of sense if you think about it: we know that when Bob receives the information required to initialise his Double Ratchet session, he can start sending messages right away, but for that he'll need a sending header key. The only way to do that while keeping the keys in sync is to let Alice generate the keys.

Finally, let's also not forget how Alice is going to use these keys she generated for Bob. Remember, Bob's sending header key is used to encrypt the header, so it has to be Alice's receiving header key if she wants to decrypt it. It's actually going to be her next receiving header key, the reason we'll see very soon. Similarly, she'll use the key she generated as Bob's next receiving header key as her own sending header key.

To recap, let's take a look at the new initialisation process with all the syncronished keys (marked with the = sign).

```
Alice---initialises (message request)--->Bob
| generates:                             |
| - root ratchet keypair              -> | - public component
| - root ratchet seed                  = | - root ratchet seed
| - sending header key                 = | - next receiving header key
| - next receiving header key          = | - sending header key
```

#### From next keys to current

I've previously mentioned that the requirement for a DH ratchet turn is that the next receiving header key decrypts the header successfully. With our new header keys, the DH ratchet turn changes too. The input is still the other party's public key, but the process is different:

1. Use the public key to generate a new DH output, which will salt the root ratchet.
2. Set the next receiving header key to the receiving header key.
3. Turn the root ratchet and generate 64 bytes of output: the first 32 bytes are the new seed for the receiving ratchet, the second 32 bytes are the new receiving header key.
4. Generate a new keychain and derive a new DH output for the root ratchet.
5. Set the next sending header key to the sending header key.
6. Turn the root ratchet and generate 64 bytes of output: the first 32 bytes are the new seed for the sending ratchet, the second 32 bytes are the new sending header key.

If that didn't make sense at first, don't worry, it didn't for me either. To summarise, at each root turn, instead of only using the output for new sending and receiving ratchets, we also use it for the next header keys.

Hopefully seeing it in code will make it clearer.

```typescript
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
type DRInit<T extends InitOptions | undefined> = T extends InitOptions ? DoubleRatchet : { dr: DoubleRatchet; SHK: Uint8Array; NRHK: Uint8Array };

class DHRatchet {
    ...

    async turn(pubkey: Uint8Array, newKey: boolean = false) {
        ...

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

    ...
}

class DoubleRatchet {
    ...

    /**
     * (Next) header keys for sending and receiving
     */
    #SHK: Uint8Array | undefined;
    #NSHK: Uint8Array | undefined;
    #RHK: Uint8Array | undefined;
    #NRHK: Uint8Array | undefined;

    ...

    async #turn(pubkey: Uint8Array) {
        ...

        const { o1: receiveSeed } = await this.root.turn(pubkey);
        this.#receive = new SymRatchet(receiveSeed);

        ...

        const { o1: sendSeed } = await this.root.turn(pubkey, true);
        this.#send = new SymRatchet(sendSeed);

        ...
    }

    ...

    static async build<T extends InitOptions | undefined>(seed: Uint8Array, init: T) {
        const dr = new DoubleRatchet();
        dr.root = await DHRatchet.build(seed);

        if (init) {
            // initialize the header keys
            dr.#SHK = init.SHK;
            dr.#NRHK = init.NRHK;

            // turn the root ratchet to create the sending ratchet and the next receiving ratchet
            const { o1: sendSeed, o2: NSHK } = await dr.root.turn(init.pubkey);
            dr.#send = new SymRatchet(sendSeed);
            dr.#NSHK = NSHK.buffer;

            return <DRInit<T>>dr;
        }

        // if there are no init options, we're the first party, generate our sending header key and next receiving header key
        dr.#SHK = globalThis.crypto.getRandomValues(new Uint8Array(32)).buffer;
        dr.#NRHK = globalThis.crypto.getRandomValues(new Uint8Array(32)).buffer;

        // return the DR session and the header keys for the other party
        return <DRInit<T>>{ dr, SHK: dr.#NRHK, NRHK: dr.#SHK };
    }
}
```

First, the `DHRatchet`'s `turn` function is updated to return 64 bytes of data instead of 32. It returns two variables: `o1` and `o2`. `o1` is the seed for a new ratchet, `o2` is the next header key. Because of the syntax change, the `DoubleRatchet`'s `turn` function is also updated to use the new `o1` variable. (We'll later use `o2` too)

The most major change is the new `build` function. Instead of a public key, it now accepts an `InitObject` with contains the public key, sending header key and next receiving header key. If it's provided, that means we're the second party, therefore we need to setup the sending ratchet, next sending header key and the two header keys we're given. Otherwise, we're the first party, so we generate our own sending header key and next receiving header key and return them alongside the Double Ratchet session. Remember: our sending header key is the other party's next receiving header key, and our next receiving header key is the other party's sending header key, that's why you see the `SHK` and `NRHK` properties being swapped.

::: note
You might also notice a lot of generic types and type casting. This is because TypeScript doesn't like it when you return different types from a function, so I had to do some type jugglery to make it work seamlessly. If you're not using TypeScript, don't bother with it, otherwise you can just copy-paste the code.
:::

Because of the new `build` function, we'll also need to change how we initialise the Double Ratchet session. This change is relatively minor, the rest of the code stays the same.

```typescript
const seed = globalThis.crypto.getRandomValues(new Uint8Array(32));

const { dr: alice, NRHK, SHK } = await DoubleRatchet.build(seed, undefined);
const bob = await DoubleRatchet.build(seed, {
	pubkey: await alice.root.getPubkey(),
	NRHK,
	SHK,
});

// rest of the code same as before
```

#### Turning the header keys

As I previously mentioned, during a root ratchet turn, we'll use the second 32 bytes of the DH ratchet's output to generate the next header keys.

```typescript
class DoubleRatchet {
    ...

    async #turn(pubkey: Uint8Array) {
        this.#RK = toHex(pubkey);

        // step 1: turn the root ratchet and use it for the receiving ratchet's seed
        const { o1: receiveSeed, o2: NRHK } = await this.root.turn(pubkey);
        this.#receive = new SymRatchet(receiveSeed);
        this.#RPN = this.#RN;
        this.#RN = 0;
        if (this.#NRHK) this.#RHK = this.#NRHK;
        this.#NRHK = NRHK.buffer;

        // step 2: turn the root ratchet again - this time with a new key - and use it for the sending ratchet's seed
        const { o1: sendSeed, o2: NSHK } = await this.root.turn(pubkey, true);
        this.#send = new SymRatchet(sendSeed);
        this.#SPN = this.#SN;
        this.#SN = 0;
        if (this.#NSHK) this.#SHK = this.#NSHK;
        this.#NSHK = NSHK.buffer;
    }

    ...
}
```

This basically does the following: next header key -> header key, DH ratchet output -> next header key, for both the sending and receiving ratchets. One small thing to notice is we'll only replace the header keys with the next header keys if there is actually a next header key. If we didn't do this check, we'd replace the header keys with undefined, which would cause problems later.

#### Using the header keys

Now that we've set up the header keys, let's use them. First, let's update the `encrypt` function, then we'll change the `processMessage` function.

Previously, we've been using AES-GCM for encryption. AES-GCM has a so-called associated data field, which is important to update when the encryption key is not changing. The Signal document recommends using at least 128 bits of entropy for the associated data and fortunately for us, `SubtleCrypto` by default uses 128 bits of entropy, so we don't need to do anything.

```typescript
...

function fromHex(hex: string) {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))).buffer;
}

...

interface MessageBundle {
    rawMessage: RawMessage;
    header: RawMessage;
}

...

class DoubleRatchet {
    ...

    async encrypt(message: Uint8Array): Promise<MessageBundle> {
        ...

        const header: Header = {
            pubkey: await this.root.getPubkey(),
            N: this.#SN,
            PN: this.#SPN,
        };

        // encrypt the header
        const headerKey = await crypto.importKey("raw", this.SHK!, { name: "AES-GCM" }, false, ["encrypt"]);
        const headerPlainText = new TextEncoder().encode(JSON.stringify(
            {
                pubkey: toHex(header.pubkey),
                N: header.N,
                PN: header.PN,
            }
        ));
        const headerIv = globalThis.crypto.getRandomValues(new Uint8Array(12));
        const headerCiphertext = new Uint8Array(await crypto.encrypt({ name: "AES-GCM", iv: headerIv }, headerKey, headerPlainText));

        this.#SN++;

        return { rawMessage: { iv, ciphertext }, header: { iv: headerIv, ciphertext: headerCiphertext} };
    }

    ...
}
```

Right now, if you're using any type of error checking, this will light up like a Christmas tree. That's because the `MessageBundle` interface has changed, its `header` property is now a `RawMessage` object instead of a `Header` object. Another small thing to note: when we convert the header into plaintext, the public kfey is converted into its hex representation, otherwise `JSON.stringify()` would skip it. You could make this nicer by using a different way of serialising the header, but for now this will work. This does mean however, that we need to implement a `fromHex` function too.

Let's quickly recap how the `processMessage` function will work, then we can finish the header encryption:

1. First, we go through our skipped message list.
2. If that fails, we try to decrypt the header with our receiving header key, then the next receiving header key.
3. If we successfully decrypted the header with the next receiving header key, we do a DH ratchet turn.
4. In the case of being unable to decrypt the header, we ignore the message.
5. After decrypting the header, the rest of the process is the same as before, except...
6. When skipping messages, instead of indexing them by the public key and `N` value, we'll index them by the receiving header key and `N` value.

If I showed all of it at once, it would be a bit confusing, so let's do it step by step. Starting with the skipped message list.

```typescript
class DoubleRatchet {
    ...

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

        ...
    }

    ...
}
```

Not bad, eh? It's basically just a linear search, which tries every header key, until it finds one that doesn't immediately errors. There's also a small optimisation: if a key is found to be correct, it's stored in the `foundHeaderKey` variable, so we don't have to import it again. This is useful if we have multiple stored messages with the same header key. After the key is found, we just check for the `N` value. If all is good, we - should - have the correct message key, which we just pass to the `decrypt` function.

Next step: Decrypting the header!

```typescript
class DoubleRatchet {
    ...

    async #decryptHeader(header: RawMessage): Promise<{ header: Header; doTurn: boolean } | null> {
        let headerPlainText: ArrayBuffer | null = null;
        let doTurn = false;

        // step 1: try the current header key
        try {
            if (!this.#RHK) throw new Error("No RHK");

            const headerKey = await crypto.importKey("raw", this.#RHK, { name: "AES-GCM" }, false, ["decrypt"]);
            headerPlainText = await crypto.decrypt({ name: "AES-GCM", iv: header.iv }, headerKey, header.ciphertext);
        } catch (e) {}

        // step 2: try the next header key
        try {
            if (!this.#NRHK) throw new Error("No NRHK");

            const headerKey = await crypto.importKey("raw", this.#NRHK, { name: "AES-GCM" }, false, ["decrypt"]);
            headerPlainText = await crypto.decrypt({ name: "AES-GCM", iv: header.iv }, headerKey, header.ciphertext);
            doTurn = true;
        } catch (e) {}

        if(!headerPlainText) return null;

        const headerJson = JSON.parse(new TextDecoder().decode(headerPlainText));

        return {
            header: {
                pubkey: fromHex(headerJson.pubkey),
                N: headerJson.N,
                PN: headerJson.PN
            },
            doTurn
        };
    }

    async processMessage(message: MessageBundle) {
        ...

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
}
```

The `decryptHeader` function does exactly what the pseudocode says: it tries to decrypt the header with the receiving header key, then the next receiving header key. If the decryption fails, it returns null, otherwise it returns the header and a boolean indicating if a DH ratchet turn is needed.

The `processMessage` function is where the real magic happens though. After checking the skipped messages list, we try to decrypt the header. If we get null, we skip the message. Otherwise, it's basically the same function as before, except when we skip messages, we index them by the receiving header key instead of the public key.

#### The final code

We can copy our previous example of skipping messages, which tests all parts of the code. Remember, the way we initialise the Double Ratchet session has changed, don't forget the new syntax! I've also logged the first message, so you can see how the header looks like.

```typescript
const seed = globalThis.crypto.getRandomValues(new Uint8Array(32));

const { dr: alice, NRHK, SHK } = await DoubleRatchet.build(seed, undefined);
const bob = await DoubleRatchet.build(seed, {
	pubkey: await alice.root.getPubkey(),
	NRHK,
	SHK,
});

// Bob sends message 1 and 2 to Alice
const message1 = await bob.encrypt(
	new TextEncoder().encode("This is message 1!"),
);
console.log("Bob sends:", message1);
const message2 = await bob.encrypt(
	new TextEncoder().encode("This is message 2!"),
);

// message 1 arrives, 2 is delayed
const decrypted1 = await alice.processMessage(message1);
console.log("Alice receives:", new TextDecoder().decode(decrypted1));

// Alice sends message 3
const message3 = await alice.encrypt(
	new TextEncoder().encode("This is message 3!"),
);

const decrypted3 = await bob.processMessage(message3);
console.log("Bob receives:", new TextDecoder().decode(decrypted3));

// Bob sends message 4, message 2 also arrives
const message4 = await bob.encrypt(
	new TextEncoder().encode("This is message 4!"),
);

const decrypted4 = await alice.processMessage(message4);
console.log("Alice receives:", new TextDecoder().decode(decrypted4));
const decrypted2 = await alice.processMessage(message2);
console.log("Alice receives:", new TextDecoder().decode(decrypted2));
```

Output:

```
Bob sends: {
  rawMessage: {
    iv: Uint8Array(12) [ 225, 213, 48, 138, 107, 101, 236, 211, 90, 214, 133, 21 ],
    ciphertext: Uint8Array(34) [ 91, 169, 149, 223, 45, 22, 10, 146, 29, 109, 65, 241, 62, 45, 108, 47, 155, 171, 73, 140, 83, 221, 161, 44, 235, 151, 98, 178, 31, 241, 191, 20, 92, 7 ]
  },
  header: {
    iv: Uint8Array(12) [ 206, 134, 104, 99, 207, 101, 154, 72, 194, 75, 70, 189 ],
    ciphertext: Uint8Array(172) [ 189, 202, 139, 14, 74, 140, 40, 54, 153, 120, 143, 169, 193, 172, 236, 91, 168, 117, 127, 46, 163, 21, 169, 22, 59, 152, 173, 66, 95, 103, 135, 234, 154, 31, 202, 166, 228, 47, 217, 218, 126, 145, 64, 230, 122, 186, 157, 0, 123, 146, 254, 122, 190, 93, 201, 171, 113, 242, 206, 198, 198, 207, 167, 200, 97, 131, 226, 191, 217, 4, 241, 33, 202, 42, 8, 35, 67, 225, 39, 214, 141, 221, 9, 25, 28, 177, 160, 16, 130, 39, 111, 243, 114, 209, 216, 173, 234, 21, 191, 240, 225, 3, 90, 33, 36, 144, 190, 89, 42, 220, 20, 244, 76, 176, 166, 114, 130, 202, 138, 87, 30, 176, 3, 220, 250, 227, 39, 165, 3, 184, 193, 73, 111, 69, 207, 195, 37, 57, 70, 107, 81, 158, 133, 251, 207, 77, 66, 248, 187, 159, 52, 28, 131, 27, 118, 249, 66, 37, 4, 33, 172, 8, 254, 169, 88, 247, 244, 234, 41, 66, 145, 10 ]
  }
}
Alice receives: This is message 1!
Bob receives: This is message 3!
Alice receives: This is message 4!
Alice receives: This is message 2!
```

As you can see, you get a beautifully encrypted header. Now if you excuse me, I'm gonna go to sleep, it's 0:42 in the morning.

The final version of the code can be found <a href="/files/double-ratchet.ts" download="double-ratchet.ts">here</a>.

### Final notes

Well congratulations, you've finally completed implementing the Double Ratchet algorithm, give yourself a hug or something.

There are still some final stuff you could improve on:

1. Currently, there is no limit to how many skipped message keys can be stored. The Signal document recommends creating one, since an attacker could send a bunch of fake messages which would just steal computational power. In practice, this limit is around 1000.
2. In our controlled environment the messages sent between Alice and Bob are supervised, but in a real world attackers could try sending random fake messages to the parties. This won't cause problems, but the code doesn't handle decryption problems yet. This means, that if a fake (or even corrupted) message is received, it'll just throw an uncatched error.
3. Technically, the `DoubleRatchet`'s `RPN` and `RK` properties are completely unused. You can remove them if you want.

Anyway, have fun!

## What else is there?

There's still an appendix waiting for you, which is about safely storing private data. If you're interested, you can read it [here](/tech/inside-e2ee/appendix-a).
