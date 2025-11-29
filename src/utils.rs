use std::{collections::HashMap, fs};

use glob::glob;
use jiff::civil::DateTime;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
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
    let languages: Vec<_> = [
        (
            ["py"],
            tree_sitter_python::LANGUAGE,
            include_str!("./queries/python/highlights.scm"),
            "",
            "",
        ),
        (
            ["sh"],
            tree_sitter_bash::LANGUAGE,
            include_str!("./queries/bash/highlights.scm"),
            "",
            "",
        ),
        (
            ["c"],
            tree_sitter_c::LANGUAGE,
            include_str!("./queries/c/highlights.scm"),
            include_str!("./queries/c/injections.scm"),
            "",
        ),
        (
            ["ts"],
            tree_sitter_typescript::LANGUAGE_TYPESCRIPT,
            include_str!("./queries/typescript/highlights.scm"),
            include_str!("./queries/typescript/injections.scm"),
            "",
        ),
        (
            ["html"],
            tree_sitter_html::LANGUAGE,
            include_str!("./queries/html/highlights.scm"),
            include_str!("./queries/html/injections.scm"),
            "",
        ),
        (
            ["json"],
            tree_sitter_json::LANGUAGE,
            include_str!("./queries/json/highlights.scm"),
            "",
            "",
        ),
    ]
    .par_iter()
    .map(|language| {
        (
            &language.0,
            HighlightConfiguration::new(
                language.1.into(),
                language.0[0],
                language.2,
                language.3,
                language.4,
            )
            .unwrap(),
        )
    })
    .collect();

    for (names, config) in languages {
        hl.add_language(names, config);
    }

    hl
}
