use serde::Serialize;
use std::{collections::HashMap, process::exit};
use time::Date;

use crate::utils::{Post, escape_html, get_posts, get_theme};

pub struct Feeds {
    pub json: String,
    pub rss: String,
    pub atom: String,
    pub html: String,
}

fn json_feed(items: &Vec<Post>, content: &HashMap<String, String>) -> String {
    #[derive(Serialize)]
    struct JSONEntry {
        id: String,
        url: String,
        title: String,
        content_html: String,
        summary: String,
        date_published: String,
        date_modified: String,
        authors: Vec<String>,
        language: String,
    }

    #[derive(Serialize)]
    struct JSONFeed {
        version: String,
        title: String,
        home_page_url: String,
        feed_url: String,
        description: String,
        favicon: String,
        language: String,
        items: Vec<JSONEntry>,
    }

    let json_entries = items
        .iter()
        .map(|item| JSONEntry {
            id: format!("https://blog.zerolimits.dev{}", item.slug),
            url: format!("https://blog.zerolimits.dev{}", item.slug),
            title: item.title.clone(),
            content_html: content.get(&item.slug).cloned().unwrap_or_default(),
            summary: item.description.clone().unwrap_or_default(),
            date_published: item.date.to_string(),
            date_modified: match item.lastmod {
                Some(lm) => lm.to_string(),
                None => item.date.to_string(),
            },
            authors: vec!["noClaps".to_string()],
            language: "en".to_string(),
        })
        .collect();

    let json_feed = JSONFeed {
        version: "https://jsonfeed.org/version/1.1".to_string(),
        title: "The Blog of Random".to_string(),
        home_page_url: "https://blog.zerolimits.dev".to_string(),
        feed_url: "https://blog.zerolimits.dev/feed.json".to_string(),
        description: "A blog about the most random things you can think of.".to_string(),
        favicon: "https://blog.zerolimits.dev/favicon.ico".to_string(),
        language: "en".to_string(),
        items: json_entries,
    };

    match serde_json::to_string(&json_feed) {
        Ok(json) => json,
        Err(err) => {
            eprintln!("[ERROR] Error serialising JSON feed: {err}");
            exit(1);
        }
    }
}

fn atom_feed(items: &Vec<Post>, content: &HashMap<String, String>, last_update: &Date) -> String {
    struct AtomEntry {
        id: String,
        title: String,
        updated: String,
        content: String,
        link: String,
        summary: String,
        published: String,
    }

    let atom_entries = items.iter().map(|item| AtomEntry {
        id: format!("https://blog.zerolimits.dev{}", item.slug),
        title: item.title.clone(),
        updated: match item.lastmod {
            Some(lm) => lm.to_string(),
            None => item.date.to_string(),
        },
        content: escape_html(content.get(&item.slug).cloned().unwrap_or_default()),
        link: format!("https://blog.zerolimits.dev{}", item.slug),
        summary: item.description.clone().unwrap_or_default(),
        published: item.date.to_string(),
    });

    let atom_feed = format!(
        r#"<?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <id>https://blog.zerolimits.dev</id>
        <title>The Blog of Random</title>
        <updated>{}</updated>
        <link rel="self" href="https://blog.zerolimits.dev/feed.atom" />
        <icon>https://blog.zerolimits.dev/favicon.ico</icon>
        <subtitle>A blog about the most random things you can think of.</subtitle>
        <author><name>noClaps</name></author>
        {}</feed>"#,
        last_update.to_string(),
        atom_entries
            .map(|entry| format!(
                r#"<entry>
          <id>{}</id>
          <title>{}</title>
          <updated>{}</updated>
          <content type="html">{}</content>
          <link rel="alternate" href="{}" />
          <summary>{}</summary>
          <published>{}</published>
        </entry>"#,
                entry.id,
                entry.title,
                entry.updated,
                entry.content,
                entry.link,
                entry.summary,
                entry.published
            ))
            .collect::<String>()
    );

    atom_feed
}

fn rss_feed(items: &Vec<Post>, content: &HashMap<String, String>, last_update: &Date) -> String {
    struct RssEntry {
        author: String,
        description: String,
        guid: String,
        link: String,
        pub_date: String,
        title: String,
        content: String,
    }

    let rss_entries = items.iter().map(|item| RssEntry {
        author: "noClaps".to_string(),
        description: item.description.clone().unwrap_or_default(),
        guid: format!("https://blog.zerolimits.dev{}", item.slug),
        link: format!("https://blog.zerolimits.dev{}", item.slug),
        pub_date: match item.lastmod {
            Some(lm) => lm.to_string(),
            None => item.date.to_string(),
        },
        title: item.title.clone(),
        content: escape_html(content.get(&item.slug).cloned().unwrap_or_default()),
    });

    let rss_feed = format!(
        r#"<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <description>A blog about the most random things you can think of.</description>
        <link>https://blog.zerolimits.dev</link>
        <title>The Blog of Random</title>
        <docs>https://www.rssboard.org/rss-specification</docs>
        <language>en</language>
        <lastBuildDate>{}</lastBuildDate>
        <pubDate>{}</pubDate>
        <atom:link href="https://blog.zerolimits.dev/feed.rss" rel="self" type="application/rss+xml" />
        {}
      </channel>
    </rss>"#,
        last_update.to_string(),
        last_update.to_string(),
        rss_entries
            .map(|entry| format!(
                r#"<item>
          <dc:creator>{}</dc:creator>
          <description>{}</description>
          <guid>{}</guid>
          <link>{}</link>
          <pubDate>{}</pubDate>
          <title>{}</title>
          <content:encoded>{}</content:encoded>
        </item>"#,
                entry.author,
                entry.description,
                entry.guid,
                entry.link,
                entry.pub_date,
                entry.title,
                entry.content
            ))
            .collect::<String>()
    );

    rss_feed
}

pub fn feeds() -> Feeds {
    let items = get_posts();

    let mut last_update = Date::MIN;
    let mut content = HashMap::new();

    for item in items.iter() {
        let item_date = match item.lastmod {
            Some(lm) => lm,
            None => item.date,
        };
        if item_date > last_update {
            last_update = item_date;
        }

        let html = znak_lang::render(item.content.clone(), get_theme());
        content.insert(item.slug.clone(), html);
    }

    Feeds {
        json: json_feed(&items, &content),
        rss: rss_feed(&items, &content, &last_update),
        atom: atom_feed(&items, &content, &last_update),
        html: include_str!("./feed.html").to_string(),
    }
}
