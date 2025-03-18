mod pages;
mod utils;

use lol_html::{HtmlRewriter, Settings, element};
use pages::{feed::feeds, index::index, posts::posts};
use std::{
    fs::{create_dir_all, read, write},
    io::Result,
    path::Path,
};

fn build_post(post: String, file_path: String) -> String {
    let mut output = vec![];

    let mut rw = HtmlRewriter::new(
        Settings {
            element_content_handlers: vec![
                element!("a[download]", |el| {
                    let href = el.get_attribute("href").unwrap();
                    let file_name = href.split("/").last().unwrap();
                    let path = format!("{}/{}", file_path.replace(".html", ""), file_name);

                    create_dir_all(Path::new(format!("dist/{path}").as_str()).parent().unwrap())?;
                    write(
                        format!("dist/{path}").as_str(),
                        read(format!("src/content/{path}")).unwrap(),
                    )?;
                    Ok(())
                }),
                element!(r#"img[src^="./"]"#, |el| {
                    let src = el.get_attribute("src").unwrap();
                    let file_name = src.split("/").last().unwrap();
                    let path = format!("{}/{}", file_path.replace(".html", ""), file_name);

                    create_dir_all(Path::new(format!("dist/{path}").as_str()).parent().unwrap())?;
                    write(
                        format!("dist/{path}").as_str(),
                        read(format!("src/content/{path}")).unwrap(),
                    )?;
                    Ok(())
                }),
            ],
            ..Settings::default()
        },
        |c: &[u8]| output.extend_from_slice(c),
    );

    rw.write(post.as_bytes()).unwrap();
    rw.end().unwrap();

    String::from_utf8(output).unwrap()
}

fn main() -> Result<()> {
    create_dir_all("dist/")?;
    write("dist/index.html", index())?;

    let feeds = feeds();
    write("dist/feed.html", feeds.html)?;
    write("dist/feed.json", feeds.json)?;
    write("dist/feed.atom", feeds.atom)?;
    write("dist/feed.rss", feeds.rss)?;

    let posts = posts();
    for post in posts {
        let path = Path::new(Box::new(format!("dist{}", post.file_path)).leak());
        create_dir_all(path.parent().unwrap())?;

        write(
            format!("dist{}", post.file_path).as_str(),
            build_post(post.post, post.file_path),
        )?;
    }

    Ok(())
}
