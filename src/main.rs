use std::{
    fs::{self, File, create_dir_all},
    io::Write,
    path::Path,
};

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
    let items = Post::get();

    let mut f = File::create("dist/feed.atom").unwrap();
    write!(f, "{}", atom_feed(&items)).unwrap();

    let mut f = File::create("dist/index.html").unwrap();
    write!(f, "{}", index).unwrap();
    let index = build_html(&index(&items));

    let posts = posts(&items);
    for post in posts {
        let file_path = post.file_path.as_str();
        let post = build_post(post.post, file_path.to_string());
        let post = build_html(&post);
        let path = format!("dist{}", file_path);
        let parent_dir = Path::new(&path).parent().unwrap();
        create_dir_all(parent_dir).unwrap();
        let mut f = File::create(format!("dist{}", file_path)).unwrap();
        write!(f, "{}", post).unwrap();
    }
}

fn build_post(input: String, file_path: String) -> String {
    let dir_path = file_path[1..].split_once("/").unwrap().0;

    rewrite_str(
        input.as_str(),
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
                    el.set_attribute("src", format!("data:;base64,{}", base64).as_str())?;

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
