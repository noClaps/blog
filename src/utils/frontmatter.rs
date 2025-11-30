use std::collections::HashMap;

pub struct Frontmatter {
    pub title: String,
    pub date: String,
    pub lastmod: Option<String>,
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
