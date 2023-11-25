const crypto = globalThis.crypto.subtle;

const alice = await crypto.generateKey(
    { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]
);

const bob = await crypto.generateKey(
    { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]
);

console.log("Generated keypairs!");

function toHex(buffer: ArrayBufferLike) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

console.log(`Alice's private key: ${toHex(await crypto.exportKey("pkcs8", alice.privateKey))}, public key: ${toHex(await crypto.exportKey("raw", alice.publicKey))}`);
console.log(`Bob's private key: ${toHex(await crypto.exportKey("pkcs8", bob.privateKey))}, public key: ${toHex(await crypto.exportKey("raw", bob.publicKey))}`);

const aliceSecret = await crypto.deriveKey(
    { name: "ECDH", public: bob.publicKey }, alice.privateKey,
    { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
);

const bobSecret = await crypto.deriveKey(
    { name: "ECDH", public: alice.publicKey }, bob.privateKey,
    { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
);

console.log("Derived shared secrets!");

console.log(`Alice's secret: ${toHex(await crypto.exportKey("raw", aliceSecret))}`);
console.log(`Bob's secret: ${toHex(await crypto.exportKey("raw", bobSecret))}`);

const data = new TextEncoder().encode("Hello, world!");

const iv = globalThis.crypto.getRandomValues(new Uint8Array(16));
const encrypted = await crypto.encrypt({ name: "AES-GCM", iv }, aliceSecret, data);

console.log(`Encrypted data: ${toHex(encrypted)}`);

const decrypted = await crypto.decrypt({ name: "AES-GCM", iv }, aliceSecret, encrypted);

console.log(`Decrypted data: ${new TextDecoder().decode(decrypted)}`);

// mark this file as a module
export {};