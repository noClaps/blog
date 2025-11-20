use tmpl::{Tmpl, apply_field};

use crate::utils::Post;

pub struct RenderedPost {
    pub file_path: String,
    pub post: Template,
}

pub struct Template {
    title: String,
    pub_date: String,
    children: String,
}
impl Tmpl for Template {
    fn render(&self, template: &str) -> String {
        apply_field!(self, title, template);
        apply_field!(self, pub_date, template);
        apply_field!(self, children, template);
        template
    }
}

pub fn posts(posts: &[Post]) -> Vec<RenderedPost> {
    posts
        .iter()
        .map(|post| {
            let post = post.clone();
            let file_path = format!("{}.html", post.slug);

            let post = Template {
                title: post.title,
                pub_date: post.date.strftime("%F").to_string(),
                children: post.content,
            };

            RenderedPost { file_path, post }
        })
        .collect()
}
