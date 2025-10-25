use std::collections::HashMap;

use askama::Template;
use jiff::civil::DateTime;
use znak::render;

use crate::utils::{Post, get_theme};

struct Entry {
    id: String,
    title: String,
    updated: String,
    content: String,
    link: String,
    published: String,
}

#[derive(Template)]
#[template(path = "feed.atom", escape = "xml")]
pub struct Feed {
    last_update: String,
    entries: Vec<Entry>,
}

fn atom_feed(items: Vec<Post>, content: HashMap<String, String>) -> Feed {
    let mut last_update = DateTime::default();
    let atom_entries = items
        .into_iter()
        .map(|item| {
            let updated = match item.lastmod {
                Some(lastmod) => lastmod,
                None => item.date,
            };
            if updated > last_update {
                last_update = updated;
            }

            Entry {
                id: format!("https://blog.zerolimits.dev{}", item.slug),
                title: item.title,
                updated: updated.to_string(),
                content: content.get(&item.slug).cloned().unwrap(),
                link: format!("https://blog.zerolimits.dev{}", item.slug),
                published: item.date.to_string(),
            }
        })
        .collect();

    let feed = Feed {
        last_update: last_update.to_string(),
        entries: atom_entries,
    };
    feed
}

pub fn feed() -> Feed {
    let items = Post::get();

    let mut content = HashMap::new();
    for item in items.clone() {
        let theme = get_theme();
        let html = render(item.content, theme);
        content.insert(item.slug, html);
    }

    atom_feed(items, content)
}
