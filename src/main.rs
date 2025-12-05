use std::io::{self, Read};

use crate::utils::{highlight::get_hl, posts::process_post};

mod utils {
    pub mod highlight;
    pub mod posts;
}

fn main() {
    // TODO: Figure out how to do Atom feed

    let mut html = String::new();
    io::stdin().read_to_string(&mut html).unwrap();

    let hl = get_hl();
    let out = process_post(&html, &hl);
    println!("{}", out);
}
