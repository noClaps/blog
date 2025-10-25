use std::{collections::HashMap, fs};

use chrono::{NaiveDate, NaiveDateTime, NaiveTime};
use glob::glob;
use znak::{Theme, parse_frontmatter};

#[derive(Clone)]
pub struct Post {
    pub slug: String,
    pub title: String,
    pub date: NaiveDateTime,
    pub lastmod: Option<NaiveDateTime>,
    pub content: String,
}
impl Post {
    pub fn get() -> Vec<Post> {
        glob("src/content/**/*.md")
            .unwrap()
            .map(|path| path.unwrap().to_string_lossy().replace("src/content/", ""))
            .map(|path| {
                let md = fs::read_to_string(format!("src/content/{}", path)).unwrap();

                // exclude `.md` from end and add `/` to start
                let slug = format!("/{}", path.strip_suffix(".md").unwrap());
                let fm = parse_frontmatter(&md).unwrap();
                let fm = Frontmatter::parse(fm);

                let date = NaiveDate::parse_from_str(&fm.date, "%Y-%m-%d")
                    .unwrap()
                    .and_time(NaiveTime::default());
                let lastmod = match fm.lastmod {
                    Some(lastmod) => Some(
                        NaiveDate::parse_from_str(&lastmod, "%Y-%m-%d")
                            .unwrap()
                            .and_time(NaiveTime::default()),
                    ),
                    None => None,
                };

                Post {
                    slug: slug,
                    title: fm.title,
                    date: date,
                    lastmod: lastmod,
                    content: md.to_string(),
                }
            })
            .collect()
    }
}

struct Frontmatter {
    title: String,
    date: String,
    lastmod: Option<String>,
}
impl Frontmatter {
    fn parse(parsed: HashMap<String, String>) -> Frontmatter {
        let title = parsed.get("title").cloned().unwrap();
        let date = parsed.get("date").cloned().unwrap();
        let lastmod = parsed.get("lastmod").cloned();
        Frontmatter {
            title,
            date,
            lastmod,
        }
    }
}

pub fn get_theme() -> Theme {
    let css = include_str!("./styles/syntax.css");
    Theme::new(css).unwrap()
}
