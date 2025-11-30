use std::{fs, path::PathBuf};

use znak::{parse_frontmatter, render};

use crate::utils::{Date, Frontmatter, get_hl};

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
