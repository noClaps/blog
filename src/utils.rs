use std::{collections::HashMap, fs};

use glob::glob;
use jiff::civil::DateTime;
use znak::{Highlight, HighlightConfiguration, parse_frontmatter, render};

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
    hl.add_language(
        &["py"],
        HighlightConfiguration::new(
            tree_sitter_python::LANGUAGE.into(),
            "python",
            include_str!("./queries/python/highlights.scm"),
            "",
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["sh"],
        HighlightConfiguration::new(
            tree_sitter_bash::LANGUAGE.into(),
            "bash",
            include_str!("./queries/bash/highlights.scm"),
            "",
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["c"],
        HighlightConfiguration::new(
            tree_sitter_c::LANGUAGE.into(),
            "c",
            include_str!("./queries/c/highlights.scm"),
            include_str!("./queries/c/injections.scm"),
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["ts"],
        HighlightConfiguration::new(
            tree_sitter_typescript::LANGUAGE_TYPESCRIPT.into(),
            "typescript",
            include_str!("./queries/typescript/highlights.scm"),
            include_str!("./queries/typescript/injections.scm"),
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["html"],
        HighlightConfiguration::new(
            tree_sitter_html::LANGUAGE.into(),
            "html",
            include_str!("./queries/html/highlights.scm"),
            include_str!("./queries/html/injections.scm"),
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["json"],
        HighlightConfiguration::new(
            tree_sitter_json::LANGUAGE.into(),
            "json",
            include_str!("./queries/json/highlights.scm"),
            "",
            "",
        )
        .unwrap(),
    );
    hl
}
