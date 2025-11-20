use std::cmp::Ordering;

use tmpl::{Tmpl, apply_field};

use crate::utils::Post;

struct PostTemplate {
    href: String,
    date: String,
    title: String,
}
impl Tmpl for PostTemplate {
    fn render(&self, template: &str) -> String {
        apply_field!(self, href, template);
        apply_field!(self, date, template);
        apply_field!(self, title, template);
        template
    }
}

pub struct Template {
    posts: Vec<PostTemplate>,
    notes: Vec<PostTemplate>,
    stories: Vec<PostTemplate>,
}
impl Tmpl for Template {
    fn render(&self, template: &str) -> String {
        apply_field!(self, [posts], template);
        apply_field!(self, [notes], template);
        apply_field!(self, [stories], template);
        template
    }
}

fn sort_func(a: &Post, b: &Post) -> Ordering {
    match (a.date, b.date) {
        (a, b) if a < b => Ordering::Greater,
        (a, b) if a > b => Ordering::Less,
        _ => Ordering::Equal,
    }
}

pub fn index(items: &[Post]) -> Template {
    let items = items.to_vec();
    let mut posts = items
        .clone()
        .into_iter()
        .filter(|item| item.slug.starts_with("/posts"))
        .collect::<Vec<Post>>();
    posts.sort_by(sort_func);
    let posts = posts
        .into_iter()
        .map(|post| PostTemplate {
            href: post.slug,
            date: post.date.strftime("%F").to_string(),
            title: post.title,
        })
        .collect::<Vec<PostTemplate>>();

    let mut notes = items
        .clone()
        .into_iter()
        .filter(|item| item.slug.starts_with("/notes"))
        .collect::<Vec<Post>>();
    notes.sort_by(sort_func);
    let notes = notes
        .into_iter()
        .map(|post| PostTemplate {
            href: post.slug,
            date: post.date.strftime("%F").to_string(),
            title: post.title,
        })
        .collect::<Vec<PostTemplate>>();

    let mut stories = items
        .into_iter()
        .filter(|item| item.slug.starts_with("/stories"))
        .collect::<Vec<Post>>();
    stories.sort_by(sort_func);
    let stories = stories
        .into_iter()
        .map(|post| PostTemplate {
            href: post.slug,
            date: post.date.strftime("%F").to_string(),
            title: post.title,
        })
        .collect::<Vec<PostTemplate>>();

    let tmpl = Template {
        posts,
        notes,
        stories,
    };
    tmpl
}
