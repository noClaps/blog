use askama::Template;

use crate::utils::Post;

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

pub fn posts(posts: &[Post]) -> Vec<RenderedPost> {
    posts
        .iter()
        .map(|post| {
            let post = post.clone();
            let file_path = format!("{}.html", post.slug);

            let post = Templ {
                title: post.title,
                pub_date: post.date.strftime("%F").to_string(),
                children: post.content,
            };

            RenderedPost { file_path, post }
        })
        .collect()
}
