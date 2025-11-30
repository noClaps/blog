use std::{fs, path::Path};

use base64::{Engine, prelude::BASE64_STANDARD};
use lol_html::{RewriteStrSettings, element, html_content::ContentType, rewrite_str};

use crate::{
    pages::{feed::atom_feed, index::index, posts::posts},
    utils::Post,
};

mod pages {
    pub mod feed;
    pub mod index;
    pub mod posts;
}
mod utils;

fn main() {
    fs::create_dir_all("dist").unwrap();
    fs::copy(
        "public/NewCMMath-Regular.woff2",
        "dist/NewCMMath-Regular.woff2",
    )
    .unwrap();

    let items = Post::get();
    fs::write("dist/feed.atom", atom_feed(&items)).unwrap();

    let index = build_html(&index(&items));
    fs::write("dist/index.html", index).unwrap();

    let posts = posts(&items);
    for post in posts {
        let file_path = post.file_path;
        let post = build_post(&post.post, &file_path);
        let post = build_html(&post);
        let path = format!("dist{}", file_path);
        let parent_dir = Path::new(&path).parent().unwrap();
        fs::create_dir_all(parent_dir).unwrap();
        fs::write(path, post).unwrap();
    }
}

fn build_post(input: &str, file_path: &str) -> String {
    let dir_path = file_path[1..].split_once("/").unwrap().0;

    rewrite_str(
        input,
        RewriteStrSettings {
            element_content_handlers: vec![
                element!("img", |el| {
                    let src = el.get_attribute("src").unwrap();
                    if !src.starts_with("./") {
                        return Ok(());
                    }
                    let src = src.trim_start_matches("./");
                    let content = fs::read(format!("src/content/{}/{}", dir_path, src))
                        .expect(&format!("Unable to find image: {}/{}", dir_path, src));
                    let base64 = BASE64_STANDARD.encode(content);

                    // don't need mime type as browser should parse automatically
                    // if i find a situation where this isn't the case,
                    // i'll find a different way to parse the image format
                    el.set_attribute("src", &format!("data:;base64,{}", base64))?;

                    Ok(())
                }),
                element!("math[display=block]", |el| {
                    el.before("<div class=\"math-block\">", ContentType::Html);
                    el.after("</div>", ContentType::Html);
                    Ok(())
                }),
            ],
            ..RewriteStrSettings::new()
        },
    )
    .unwrap()
}

fn build_html(input: &str) -> String {
    input.replace(
        "<a href=\"https://",
        "<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"http://",
    )
}
