use std::cmp::Ordering;

use askama::Template;

use crate::utils::Post;

struct PostTmpl {
    href: String,
    date: String,
    title: String,
}
#[derive(Template)]
#[template(path = "index.html", escape = "none")]
pub struct Templ {
    posts: Vec<PostTmpl>,
    notes: Vec<PostTmpl>,
    stories: Vec<PostTmpl>,
}

fn sort_func(a: &Post, b: &Post) -> Ordering {
    match (a.date, b.date) {
        (a, b) if a < b => Ordering::Greater,
        (a, b) if a > b => Ordering::Less,
        _ => Ordering::Equal,
    }
}

pub fn index(items: &[Post]) -> Templ {
    let items = items.to_vec();
    let mut posts = items
        .clone()
        .into_iter()
        .filter(|item| item.slug.starts_with("/posts"))
        .collect::<Vec<Post>>();
    posts.sort_by(sort_func);
    let posts = posts
        .into_iter()
        .map(|post| PostTmpl {
            href: post.slug,
            date: post.date.strftime("%F").to_string(),
            title: post.title,
        })
        .collect::<Vec<PostTmpl>>();

    let mut notes = items
        .clone()
        .into_iter()
        .filter(|item| item.slug.starts_with("/notes"))
        .collect::<Vec<Post>>();
    notes.sort_by(sort_func);
    let notes = notes
        .into_iter()
        .map(|post| PostTmpl {
            href: post.slug,
            date: post.date.strftime("%F").to_string(),
            title: post.title,
        })
        .collect::<Vec<PostTmpl>>();

    let mut stories = items
        .into_iter()
        .filter(|item| item.slug.starts_with("/stories"))
        .collect::<Vec<Post>>();
    stories.sort_by(sort_func);
    let stories = stories
        .into_iter()
        .map(|post| PostTmpl {
            href: post.slug,
            date: post.date.strftime("%F").to_string(),
            title: post.title,
        })
        .collect::<Vec<PostTmpl>>();

    let tmpl = Templ {
        posts,
        notes,
        stories,
    };
    tmpl
}
