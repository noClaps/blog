use crate::utils::Post;

pub struct RenderedPost {
    pub file_path: String,
    pub post: String,
}

pub fn posts(posts: &[Post]) -> Vec<RenderedPost> {
    posts
        .iter()
        .map(|post| {
            let post = post.clone();
            let file_path = format!("{}.html", post.slug);

            let title = post.title;
            let pub_date = post.date.strftime("%F");
            let children = post.content;
            let post = format!(
                include_str!("./posts.html"),
                title,
                include_str!("../../styles/global.css"),
                include_str!("../../styles/post.css"),
                pub_date,
                pub_date,
                title,
                children
            );

            RenderedPost { file_path, post }
        })
        .collect()
}
