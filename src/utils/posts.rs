use std::{fs, path::PathBuf};

use highlight::Highlight;
use kuchikiki::{parse_html, traits::TendrilSink};

pub fn get_posts(path: PathBuf) -> Vec<String> {
    let mut files = vec![];

    for dir_entry in fs::read_dir(path).unwrap() {
        let dir_entry = dir_entry.unwrap();
        let path = dir_entry.path();
        if path.is_dir() {
            files.append(&mut get_posts(path));
        } else if path.is_file() && path.extension().is_some_and(|ext| ext == "typ") {
            let path = path.to_string_lossy();
            let path = path
                .trim_end_matches(".typ")
                .trim_start_matches("src/content/")
                .to_string();
            files.push(path);
        }
    }

    files
}

pub fn process_post(html: &str, hl: &Highlight) -> String {
    let document = parse_html().one(html);
    let mut to_detach = vec![];
    for css_match in document.select("code[data-lang]").unwrap() {
        let attributes = css_match.attributes.borrow();
        let lang = attributes.get("data-lang").unwrap();
        let text_node = css_match
            .as_node()
            .children()
            .filter_map(|c| match c.as_element() {
                None => Some(c.text_contents()),
                Some(_) => Some("\n".to_string()),
            });
        let code = text_node.collect::<Vec<_>>().join("");

        let highlighted = hl.highlight(&code, lang);
        let highlighted = kuchikiki::parse_html().one(highlighted);
        let new_node = highlighted.select_first("code").unwrap().as_node().clone();

        let old_node = css_match.as_node().clone();
        old_node.insert_after(new_node);
        to_detach.push(old_node);
    }
    for node in to_detach {
        node.detach();
    }

    document.to_string()
}
