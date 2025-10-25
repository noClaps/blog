use askama::Template;
use znak::render;

use crate::utils::{Post, get_theme};

pub struct RenderedPost {
    pub file_path: String,
    pub post: Templ,
}

#[derive(Template)]
#[template(path = "posts.html", escape = "none")]
pub struct Templ {
    title: String,
    pub_date: String,
    children: String,
}

pub fn posts() -> Vec<RenderedPost> {
    let posts = Post::get();

    posts
        .into_iter()
        .map(|post| {
            let file_path = format!("{}.html", post.slug);
            let theme = get_theme();

            let content = render(post.content, theme);
            let post = Templ {
                title: post.title,
                pub_date: post.date.strftime("%F").to_string(),
                children: content,
            };

            RenderedPost { file_path, post }
        })
        .collect()
}
