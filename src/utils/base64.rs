// https://www.sunshine2k.de/articles/coding/base64/understanding_base64.html
// https://github.com/kujirahand/rust-base64-light/blob/main/src/lib.rs

const ALPHABET: [char; 64] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9', '+', '/',
];

pub fn base64_encode(bytes: &[u8]) -> String {
    let mut output = String::new();
    let count = bytes.len() / 3;
    for i in 0..count {
        let n = i * 3;

        // 12345678 12345678 12345678
        // 123456 781234 567812 345678
        let b1 = bytes[n] as usize;
        let b2 = bytes[n + 1] as usize;
        let b3 = bytes[n + 2] as usize;

        output.push(ALPHABET[b1 >> 2]);
        output.push(ALPHABET[((b1 & 0x3) << 4) | (b2 >> 4)]);
        output.push(ALPHABET[((b2 & 0xf) << 2) | (b3 >> 6)]);
        output.push(ALPHABET[b3 & 0x3f]);
    }
    match bytes.len() % 3 {
        1 => {
            // 12345678 00000000 00000000
            // 123456 780000 000000 000000
            let b = bytes[count * 3] as usize;
            output.push(ALPHABET[b >> 2]);
            output.push(ALPHABET[(b & 0x3) << 4]);
            output.push_str("==");
        }
        2 => {
            // 12345678 12345678 00000000
            // 123456 781234 567800 000000
            let b1 = bytes[count * 3] as usize;
            let b2 = bytes[count * 3 + 1] as usize;
            output.push(ALPHABET[b1 >> 2]);
            output.push(ALPHABET[((b1 & 0x3) << 4) | (b2 >> 4)]);
            output.push(ALPHABET[(b2 & 0xf) << 2]);
            output.push('=');
        }
        _ => (),
    }

    output
}
