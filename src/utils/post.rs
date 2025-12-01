use std::{collections::HashMap, fs, path::PathBuf};

use znak::{Highlight, HighlightConfiguration, parse_frontmatter, render};

use crate::utils::date::Date;

#[derive(Clone)]
pub struct Post {
    pub slug: String,
    pub title: String,
    pub date: Date,
    pub lastmod: Option<Date>,
    pub content: String,
}
impl Post {
    pub fn get() -> Vec<Post> {
        let hl = get_hl();
        Self::get_files(PathBuf::from("src/content"))
            .iter()
            .map(|path| {
                let path = path.to_string_lossy().replace("src/content/", "");
                let md = fs::read_to_string(format!("src/content/{}", path)).unwrap();

                // exclude `.md` from end and add `/` to start
                let slug = format!("/{}", path.strip_suffix(".md").unwrap());
                let fm = parse_frontmatter(&md).unwrap();
                let fm = Frontmatter::parse(fm);

                let date = fm.date.parse().unwrap();
                let lastmod = fm.lastmod.and_then(|lastmod| lastmod.parse().ok());

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

    fn get_files(path: PathBuf) -> Vec<PathBuf> {
        let mut files = vec![];

        for dir_entry in fs::read_dir(path).unwrap() {
            let dir_entry = dir_entry.unwrap();
            let path = dir_entry.path();
            if path.is_dir() {
                files.append(&mut Self::get_files(path));
            } else if path.is_file() && path.extension().is_some_and(|ext| ext == "md") {
                files.push(path);
            }
        }

        files
    }
}

struct Frontmatter {
    title: String,
    date: String,
    lastmod: Option<String>,
}
impl Frontmatter {
    pub fn parse(parsed: HashMap<String, String>) -> Frontmatter {
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
    let theme = include_str!("../styles/syntax.css").parse().unwrap();
    let mut hl = Highlight::new(theme);
    hl.add_language(
        &["py"],
        HighlightConfiguration::new(
            tree_sitter_python::LANGUAGE.into(),
            "python",
            include_str!("../queries/python/highlights.scm"),
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
            include_str!("../queries/bash/highlights.scm"),
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
            include_str!("../queries/c/highlights.scm"),
            include_str!("../queries/c/injections.scm"),
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["ts"],
        HighlightConfiguration::new(
            tree_sitter_typescript::LANGUAGE_TYPESCRIPT.into(),
            "typescript",
            include_str!("../queries/typescript/highlights.scm"),
            include_str!("../queries/typescript/injections.scm"),
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["html"],
        HighlightConfiguration::new(
            tree_sitter_html::LANGUAGE.into(),
            "html",
            include_str!("../queries/html/highlights.scm"),
            include_str!("../queries/html/injections.scm"),
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["json"],
        HighlightConfiguration::new(
            tree_sitter_json::LANGUAGE.into(),
            "json",
            include_str!("../queries/json/highlights.scm"),
            "",
            "",
        )
        .unwrap(),
    );
    hl
}
