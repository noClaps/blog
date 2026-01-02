use std::{
    env::args,
    io::{self, Read},
};

use regex::Regex;

use crate::highlight::highlight;

mod highlight;

fn main() {
    if args().nth(1).is_some_and(|a| a == "feed") {
        let mut html = String::new();
        io::stdin().read_to_string(&mut html).unwrap();

        println!("{}", process_feed(&html));
        return;
    }

    let mut html = String::new();
    io::stdin().read_to_string(&mut html).unwrap();

    let mut out = html;
    while let updated = process_post(&out)
        && updated != out
    {
        out = updated;
    }

    println!("{}", out);
}

macro_rules! unescape_html {
    ($input:expr) => {
        $input
            .replace("&amp;", "&")
            .replace("&quot;", "\"")
            .replace("&#x27;", "'")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
    };
}

fn process_feed(html: &str) -> String {
    let start_index = html.find("<p>").unwrap() + 3;
    let end_index = start_index + html[start_index..].find("</p>").unwrap();
    unescape_html!(&html[start_index..end_index])
}

fn process_post(html: &str) -> String {
    let mut edited = html.to_string();

    for (_, [lang, code]) in Regex::new(r#"<code data-lang="(\w+)">(.*)"#)
        .unwrap()
        .captures_iter(html)
        .map(|c| c.extract())
    {
        let end_index = code.find("</code>").unwrap();
        let code = &code[..end_index];

        let highlighted = highlight(&unescape_html!(code.replace("<br>", "\n")), lang);
        edited = edited.replace(
            &format!("<code data-lang=\"{lang}\">{code}</code>"),
            &format!("<code>{highlighted}</code>"),
        );
    }

    edited
}
