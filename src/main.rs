use std::{
    env::args,
    io::{self, Read},
};

use highlight::Highlight;

use crate::utils::{feed::process_feed, posts::process_post};

mod utils {
    pub mod feed;
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

    let hl = Highlight::new();
    let out = process_post(&html, &hl);
    println!("{}", out);
}
