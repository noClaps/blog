use std::{collections::HashMap, fs};

use glob::glob;
use jiff::civil::DateTime;
use znak::{Highlight, Theme, parse_frontmatter};

#[derive(Clone)]
pub struct Post {
    pub slug: String,
    pub title: String,
    pub date: DateTime,
    pub lastmod: Option<DateTime>,
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

                let date: DateTime = fm.date.parse().unwrap();
                let lastmod: Option<DateTime> = match fm.lastmod {
                    Some(lastmod) => Some(lastmod.parse().unwrap()),
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

pub fn get_hl() -> Highlight {
    let css = include_str!("./styles/syntax.css");
    let theme = Theme::new(css).unwrap();
    Highlight::new(theme)
}
