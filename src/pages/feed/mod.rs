use html::escape_html;
use jiff::civil::DateTime;

use crate::utils::Post;

pub fn atom_feed(items: &[Post]) -> String {
    let mut last_update = DateTime::default();
    let atom_entries: String = items
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

            let id = format!("https://blog.zerolimits.dev{}", item.slug);
            let title = item.title;
            let content = escape_html!(item.content);
            let link = format!("https://blog.zerolimits.dev{}", item.slug);
            let published = item.date;
            format!(
                include_str!("./entry.atom"),
                id, title, updated, content, link, published
            )
        })
        .collect();

    format!(include_str!("./feed.atom"), last_update, atom_entries)
}
