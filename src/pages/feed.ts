import { render } from "@noclaps/znak";
import { getCollection, removeFrontmatter } from "../../scripts/utils";

const postItems = await getCollection("posts");
const noteItems = await getCollection("notes");
const storyItems = await getCollection("stories");

for (const item of noteItems) {
  item.slug = `notes/${item.slug}`;
}

for (const item of storyItems) {
  item.slug = `stories/${item.slug}`;
}

const items = [...postItems, ...noteItems, ...storyItems];

let lastUpdate = new Date(0);
const content: { [key: string]: string } = {};
for (const item of items) {
  const itemDate = item.lastmod ?? item.date;
  if (itemDate > lastUpdate) {
    lastUpdate = itemDate;
  }

  const html = await Bun.file(
    `src/content/${item.slug.startsWith("notes") || item.slug.startsWith("stories") ? "" : "posts/"}${
      item.slug
    }.md`,
  )
    .text()
    .then(async (md) => await render(removeFrontmatter(md)));
  content[item.slug] = html;
}

export function jsonFeed() {
  const entries = items.map((item) => ({
    id: `https://blog.zerolimits.dev/${item.slug}`,
    url: `https://blog.zerolimits.dev/${item.slug}`,
    title: item.title,
    content_html: content[item.slug],
    summary: item.description ?? "",
    date_published: new Date(item.date).toISOString(),
    date_modified: new Date(item.lastmod ?? item.date),
    authors: ["noClaps"],
    language: "en",
  }));

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "The Blog of Random",
    home_page_url: "https://blog.zerolimits.dev",
    feed_url: "https://blog.zerolimits.dev/feed.json",
    description: "A blog about the most random things you can think of.",
    favicon: "https://blog.zerolimits.dev/favicon.ico",
    language: "en",
    items: entries,
  };

  return JSON.stringify(feed);
}

export function atomFeed() {
  const entries = items.map((item) => ({
    id: `https://blog.zerolimits.dev/${item.slug}`,
    title: item.title,
    updated: new Date(item.lastmod ?? item.date).toISOString(),
    content: Bun.escapeHTML(content[item.slug]),
    link: `https://blog.zerolimits.dev/${item.slug}`,
    summary: "description" in item ? item.description : "",
    published: "date" in item ? new Date(item.date).toISOString() : "",
  }));

  const feed = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><id>https://blog.zerolimits.dev</id><title>The Blog of Random</title><updated>${new Date(lastUpdate).toISOString()}</updated><link rel="self" href="https://blog.zerolimits.dev/feed.atom" /><icon>https://blog.zerolimits.dev/favicon.ico</icon><subtitle>A blog about the most random things you can think of.</subtitle><author><name>noClaps</name></author>${entries
    .map(
      (entry) =>
        `<entry><id>${entry.id}</id><title>${entry.title}</title><updated>${entry.updated}</updated><content type="html">${entry.content}</content><link rel="alternate" href="${entry.link}" /><summary>${entry.summary}</summary><published>${entry.published}</published></entry>`,
    )
    .join("")}</feed>`;

  return feed;
}

export function rssFeed() {
  const entries = items.map((item) => ({
    author: "noClaps",
    description: item.description ?? "",
    guid: `https://blog.zerolimits.dev/${item.slug}`,
    link: `https://blog.zerolimits.dev/${item.slug}`,
    pubDate: new Date(item.lastmod ?? item.date).toUTCString(),
    title: item.title,
    content: Bun.escapeHTML(content[item.slug]),
  }));

  const feed = `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom"><channel><description>A blog about the most random things you can think of.</description><link>https://blog.zerolimits.dev</link><title>The Blog of Random</title><docs>https://www.rssboard.org/rss-specification</docs><language>en</language><lastBuildDate>${new Date(lastUpdate).toUTCString()}</lastBuildDate><pubDate>${new Date(lastUpdate).toUTCString()}</pubDate><atom:link href="https://blog.zerolimits.dev/feed.rss" rel="self" type="application/rss+xml" />${entries
    .map(
      (entry) =>
        `<item><dc:creator>${entry.author}</dc:creator><description>${entry.description}</description><guid>${entry.guid}</guid><link>${entry.link}</link><pubDate>${entry.pubDate}</pubDate><title>${entry.title}</title><content:encoded>${entry.content}</content:encoded></item>`,
    )
    .join("")}</channel></rss>`;

  return feed;
}
