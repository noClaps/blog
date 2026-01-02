use regex::Regex;

use crate::{unescape_html, utils::highlight::highlight};

pub fn process_post(html: &str) -> String {
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
