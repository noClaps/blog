use std::{cmp::Ordering, process::exit};
use time::{Date, format_description::well_known::Iso8601};

use crate::utils::{Post, get_posts};

struct LinkProps {
    title: String,
    href: String,
    date: Date,
}

fn link(props: LinkProps) -> String {
    let title = props.title;
    let href = props.href;
    let date = props.date;

    format!(
        r#"<a class="link" href="{href}">{}<h3>{title}</h3></a>"#,
        format!(
            r#"<time datetime="{}">{}</time>"#,
            match date.format(&Iso8601::DATE) {
                Ok(date) => date,
                Err(err) => {
                    eprintln!("[ERROR] line {}: Error formatting date: {err}", line!());
                    exit(1);
                }
            },
            match date.format(&Iso8601::DATE) {
                Ok(date) => date,
                Err(err) => {
                    eprintln!("[ERROR] line {}: Error formatting date: {err}", line!());
                    exit(1)
                }
            }
        )
    )
}

pub fn index() -> String {
    let sort_posts = |a: &Post, b: &Post| -> Ordering {
        let a_date = match a.lastmod {
            Some(lm) => lm,
            None => a.date,
        };
        let b_date = match b.lastmod {
            Some(lm) => lm,
            None => b.date,
        };

        if a_date > b_date {
            return Ordering::Less;
        };
        if a_date < b_date {
            return Ordering::Greater;
        }
        Ordering::Equal
    };

    let items = get_posts();
    let mut posts = items
        .iter()
        .filter(|i| i.slug.starts_with("/posts/"))
        .cloned()
        .collect::<Vec<Post>>();
    posts.sort_by(sort_posts);
    let mut notes = items
        .iter()
        .filter(|i| i.slug.starts_with("/notes/"))
        .cloned()
        .collect::<Vec<Post>>();
    notes.sort_by(sort_posts);
    let mut stories = items
        .iter()
        .filter(|i| i.slug.starts_with("/stories/"))
        .cloned()
        .collect::<Vec<Post>>();
    stories.sort_by(sort_posts);

    include_str!("./index.html")
        .to_string()
        .replace(
            "{{ posts }}",
            posts
                .iter()
                .map(|p| {
                    link(LinkProps {
                        title: p.title.clone(),
                        href: p.slug.clone(),
                        date: match p.lastmod {
                            Some(lm) => lm,
                            None => p.date,
                        },
                    })
                })
                .collect::<String>()
                .as_str(),
        )
        .replace(
            "{{ notes }}",
            notes
                .iter()
                .map(|p| {
                    link(LinkProps {
                        title: p.title.clone(),
                        href: p.slug.clone(),
                        date: match p.lastmod {
                            Some(lm) => lm,
                            None => p.date,
                        },
                    })
                })
                .collect::<String>()
                .as_str(),
        )
        .replace(
            "{{ stories }}",
            stories
                .iter()
                .map(|p| {
                    link(LinkProps {
                        title: p.title.clone(),
                        href: p.slug.clone(),
                        date: match p.lastmod {
                            Some(lm) => lm,
                            None => p.date,
                        },
                    })
                })
                .collect::<String>()
                .as_str(),
        )
}
