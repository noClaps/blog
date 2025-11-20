use html::escape_html;
use jiff::civil::DateTime;
use tmpl::{Tmpl, apply_field};

use crate::utils::Post;

struct Entry {
    id: String,
    title: String,
    updated: String,
    content: String,
    link: String,
    published: String,
}
impl Tmpl for Entry {
    fn render(&self, template: &str) -> String {
        apply_field!(self, id, template);
        apply_field!(self, title, template);
        apply_field!(self, updated, template);
        apply_field!(self, content, template);
        apply_field!(self, link, template);
        apply_field!(self, published, template);
        template
    }
}

pub struct Feed {
    last_update: String,
    entries: Vec<Entry>,
}
impl Tmpl for Feed {
    fn render(&self, template: &str) -> String {
        apply_field!(self, last_update, template);
        apply_field!(self, [entries], template);
        template
    }
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
                content: escape_html!(item.content),
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
