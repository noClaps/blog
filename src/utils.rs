use glob::glob;
use std::{collections::HashMap, fs::read, process::exit};
use time::{Date, macros::format_description};
use znak_lang::{Theme, frontmatter};

#[derive(Debug, Clone)]
pub struct Post {
    pub slug: String,
    pub title: String,
    pub description: Option<String>,
    pub date: Date,
    pub lastmod: Option<Date>,
    pub content: String,
}

struct Frontmatter {
    title: String,
    description: Option<String>,
    date: String,
    lastmod: Option<String>,
}

impl Frontmatter {
    fn from(parsed: HashMap<String, String>) -> Self {
        Frontmatter {
            title: parsed.get("title").cloned().unwrap(),
            description: parsed.get("description").cloned(),
            date: parsed.get("date").cloned().unwrap(),
            lastmod: parsed.get("lastmod").cloned(),
        }
    }
}

pub fn get_posts() -> Vec<Post> {
    let md_files = match glob("src/content/**/*.md") {
        Ok(dir) => dir,
        Err(err) => {
            eprintln!("ERROR: Error reading content directory: {err}");
            exit(1);
        }
    };
    let mut data = Vec::new();

    for file in md_files {
        match file {
            Err(err) => {
                eprintln!("ERROR: Error reading path: {err}");
                continue;
            }
            Ok(file) => {
                let md = match read(file.clone()) {
                    Err(err) => {
                        eprintln!("ERROR: Error reading file: {err}");
                        continue;
                    }
                    Ok(f) => match String::from_utf8(f) {
                        Ok(str) => str,
                        Err(err) => {
                            eprintln!("ERROR: Error converting utf8 to String: {err}");
                            continue;
                        }
                    },
                };

                let file_str = file.to_string_lossy();
                // Exclude `src/content` from start and `.md` from end
                let slug = file_str[11..file_str.len() - 3].to_string();

                let fm = match frontmatter(md.clone()) {
                    Some(fm) => Frontmatter::from(fm),
                    None => {
                        eprintln!("ERROR: Error reading frontmatter from file: {}", slug);
                        continue;
                    }
                };
                let format = format_description!("[year]-[month]-[day]");
                let date = match Date::parse(&fm.date, &format) {
                    Ok(date) => date,
                    Err(err) => {
                        eprintln!("ERROR: Error parsing date: {err}");
                        continue;
                    }
                };
                let lastmod = match fm.lastmod {
                    None => None,
                    Some(lastmod) => match Date::parse(&lastmod, &format) {
                        Ok(date) => Some(date),
                        Err(err) => {
                            eprintln!("ERROR: Error parsing lastmod: {err}");
                            continue;
                        }
                    },
                };
                data.push(Post {
                    slug,
                    title: fm.title,
                    description: fm.description,
                    date,
                    lastmod,
                    content: md,
                });
            }
        }
    }

    data
}

pub fn get_theme() -> Theme {
    let theme_file = include_str!("../theme.toml").to_string();
    let theme = match Theme::new(theme_file) {
        Ok(theme) => theme,
        Err(err) => {
            eprintln!("[ERROR] Error parsing theme: {err}");
            exit(1);
        }
    };

    theme
}

pub fn escape_html(input: String) -> String {
    input
        .replace('&', "&amp;")
        .replace('"', "&quot;")
        .replace("'", "&#x27;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
}
