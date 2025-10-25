use std::{
    fs::{self, File, create_dir_all},
    io::Write,
    path::Path,
};

use askama::Template;
use base64::{Engine, prelude::BASE64_STANDARD};
use glob::glob;
use image::{GenericImageView, guess_format, load_from_memory_with_format};
use lol_html::{RewriteStrSettings, element, html_content::ContentType, rewrite_str};

use crate::pages::{feed::feed, index::index, posts::posts};

mod pages;
mod utils;

fn main() {
    let mut f = File::create("dist/feed.atom").unwrap();
    feed().write_into(&mut f).unwrap();

    let mut f = File::create("dist/index.html").unwrap();
    let index = build_html(index().render().unwrap());
    write!(f, "{}", index).unwrap();

    let posts = posts();
    for post in posts {
        let file_path = post.file_path.as_str();
        let post = post.post;
        let post = post.render().unwrap();
        let post = build_post(post, file_path.to_string());
        let post = build_html(post);
        let path = format!("dist{}", file_path);
        let parent_dir = Path::new(&path).parent().unwrap();
        create_dir_all(parent_dir).unwrap();
        let mut f = File::create(format!("dist{}", file_path)).unwrap();
        write!(f, "{}", post).unwrap();
    }
}

fn build_post(input: String, file_path: String) -> String {
    let images = glob("src/content/**/*.png")
        .unwrap()
        .chain(glob("src/content/**/*.gif").unwrap())
        .map(|path| path.unwrap().to_string_lossy().replace("src/content/", ""))
        .collect::<Vec<String>>();
    let dir_path = file_path[1..].split_once("/").unwrap().0;

    rewrite_str(
        input.as_str(),
        RewriteStrSettings {
            element_content_handlers: vec![element!("img", |el| {
                let src = el.get_attribute("src").unwrap();
                if !src.starts_with("./") {
                    return Ok(());
                }
                let src = src.trim_start_matches("./");
                let content = images
                    .iter()
                    .find(|&img| *img == format!("{}/{}", dir_path, src))
                    .and_then(|img| fs::read(format!("src/content/{}", img)).ok())
                    .expect(format!("Unable to find image: {}/{}", dir_path, src).as_str());
                let format = guess_format(&content)?;
                let image = load_from_memory_with_format(&content, format)?;
                let (width, height) = image.dimensions();
                let mime_type = format.to_mime_type();
                let base64 = BASE64_STANDARD.encode(content);

                el.set_attribute(
                    "src",
                    format!("data:{};base64,{}", mime_type, base64).as_str(),
                )?;
                el.set_attribute("width", width.to_string().as_str())?;
                el.set_attribute("height", height.to_string().as_str())?;

                Ok(())
            })],
            ..RewriteStrSettings::new()
        },
    )
    .unwrap()
}

fn build_html(input: String) -> String {
    let styles = glob("src/styles/*.css")
        .unwrap()
        .map(|path| path.unwrap().to_string_lossy().replace("src/styles/", ""))
        .collect::<Vec<String>>();

    rewrite_str(
        input.as_str(),
        RewriteStrSettings {
            element_content_handlers: vec![
                element!("a", |el| {
                    let href = el.get_attribute("href").unwrap();
                    if !href.starts_with("https://") {
                        return Ok(());
                    }
                    el.set_attribute("target", "_blank")?;
                    el.set_attribute("rel", "noopener noreferrer")?;
                    Ok(())
                }),
                element!("link[rel=stylesheet]", |el| {
                    let href = el.get_attribute("href").unwrap().replace("/styles/", "");
                    let css = styles
                        .iter()
                        .find(|style| **style == href)
                        .and_then(|css| fs::read_to_string(format!("src/styles/{}", css)).ok())
                        .expect(format!("Unable to find CSS: {}", href).as_str());
                    el.replace(
                        format!("<style>{}</style>", css).as_str(),
                        ContentType::Html,
                    );
                    Ok(())
                }),
            ],
            ..RewriteStrSettings::new()
        },
    )
    .unwrap()
}
