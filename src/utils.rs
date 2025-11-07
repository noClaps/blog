use std::{collections::HashMap, fs};

use glob::glob;
use jiff::civil::DateTime;
use tree_sitter_languages::{bash, c, html, json, python, typescript};
use znak::{Highlight, parse_frontmatter, render};

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
        let hl = get_hl();
        glob("src/content/**/*.md")
            .unwrap()
            .map(|path| {
                let path = path.unwrap().to_string_lossy().replace("src/content/", "");
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

                let content = render(&md, &hl);

                Post {
                    slug: slug,
                    title: fm.title,
                    date: date,
                    lastmod: lastmod,
                    content,
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

fn get_hl() -> Highlight {
    let theme = include_str!("./styles/syntax.css").parse().unwrap();
    let mut hl = Highlight::new(theme);
    hl.add_language(&["py"], python::highlight_configuration());
    hl.add_language(&["sh"], bash::highlight_configuration());
    hl.add_language(&["c"], c::highlight_configuration());
    hl.add_language(&["ts"], typescript::highlight_configuration_typescript());
    hl.add_language(&["html"], html::highlight_configuration());
    hl.add_language(&["json"], json::highlight_configuration());
    hl
}
