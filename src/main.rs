use std::{
    env::args,
    io::{self, Read},
};

use crate::utils::{feed::process_feed, highlight::get_hl, posts::process_post};

mod utils {
    pub mod feed;
    pub mod highlight;
    pub mod posts;
}

fn main() {
    if args().nth(1).is_some_and(|a| a == "feed") {
        let mut html = String::new();
        io::stdin().read_to_string(&mut html).unwrap();

        println!("{}", process_feed(&html));
        return;
    }

    let mut html = String::new();
    io::stdin().read_to_string(&mut html).unwrap();

    let hl = get_hl();
    let out = process_post(&html, &hl);
    println!("{}", out);
}
