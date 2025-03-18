use znak_lang::render;

use crate::utils::{get_posts, get_theme};

pub struct RenderedPost {
    pub file_path: String,
    pub post: String,
}

pub fn posts() -> Vec<RenderedPost> {
    let posts = get_posts();
    let post_template = include_str!("./posts.html").to_string();

    let rendered_posts = posts
        .iter()
        .map(|post| RenderedPost {
            file_path: format!("{}.html", post.slug),
            post: post_template
                .replace("{{ title }}", &post.title)
                .replace(
                    "{{ description }}",
                    &post.description.clone().unwrap_or(
                        "A blog about the most random things you can think of.".to_string(),
                    ),
                )
                .replace(
                    "{{ pub_date }}",
                    match post.lastmod {
                        Some(lm) => lm.to_string(),
                        None => post.date.to_string(),
                    }
                    .as_str(),
                )
                .replace(
                    "{{ post_desc }}",
                    match &post.description {
                        None => "",
                        Some(desc) => {
                            Box::new(format!(r#"<p class="description">{}</p>"#, desc)).leak()
                        }
                    },
                )
                .replace(
                    "{{ children }}",
                    render(post.content.clone(), get_theme()).as_str(),
                ),
        })
        .collect();

    rendered_posts
}
