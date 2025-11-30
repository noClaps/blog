use std::cmp::Ordering;

use crate::utils::Post;

fn sort_func(a: &Post, b: &Post) -> Ordering {
    match (a.date, b.date) {
        (a, b) if a < b => Ordering::Greater,
        (a, b) if a > b => Ordering::Less,
        _ => Ordering::Equal,
    }
}

pub fn index(items: &[Post]) -> String {
    let items = items.to_vec();
    let mut posts = items
        .clone()
        .into_iter()
        .filter(|item| item.slug.starts_with("/posts"))
        .collect::<Vec<Post>>();
    posts.sort_by(sort_func);
    let posts: String = posts
        .into_iter()
        .map(|post| {
            let href = post.slug;
            let date = post.date.strftime("%F");
            let title = post.title;
            format!(include_str!("./post.html"), href, date, date, title)
        })
        .collect();

    let mut notes = items
        .clone()
        .into_iter()
        .filter(|item| item.slug.starts_with("/notes"))
        .collect::<Vec<Post>>();
    notes.sort_by(sort_func);
    let notes: String = notes
        .into_iter()
        .map(|post| {
            let href = post.slug;
            let date = post.date.strftime("%F");
            let title = post.title;
            format!(include_str!("./post.html"), href, date, date, title)
        })
        .collect();

    let mut stories = items
        .into_iter()
        .filter(|item| item.slug.starts_with("/stories"))
        .collect::<Vec<Post>>();
    stories.sort_by(sort_func);
    let stories: String = stories
        .into_iter()
        .map(|post| {
            let href = post.slug;
            let date = post.date.strftime("%F");
            let title = post.title;
            format!(include_str!("./post.html"), href, date, date, title)
        })
        .collect();

    format!(
        include_str!("./index.html"),
        include_str!("../../styles/global.css"),
        include_str!("../../styles/index.css"),
        posts,
        notes,
        stories
    )
}
