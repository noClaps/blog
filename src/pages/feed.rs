use askama::Template;
use jiff::civil::DateTime;

use crate::utils::Post;

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

pub fn atom_feed(items: &[Post]) -> Feed {
    let mut last_update = DateTime::default();
    let atom_entries = items
        .iter()
        .map(|item| {
            let item = item.clone();
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
                content: item.content,
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
