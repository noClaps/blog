import parseMarkdown from "../../tools/markdown";
import { getCollection } from "../../tools/utils";
import BaseLayout from "../layouts/BaseLayout";

const postItems = await getCollection("posts");
const noteItems = await getCollection("notes");

for (const item of noteItems) {
  item.slug = `notes/${item.slug}`;
}

const items = [...postItems, ...noteItems];

let lastUpdate = 0;
for (const item of items) {
  const itemDate = item.lastmod ?? item.date;
  if (itemDate > lastUpdate) {
    lastUpdate = itemDate;
  }
}

async function jsonFeed() {
  const entries = await Promise.all(
    items.map(async (item) => {
      const md = await Bun.file(
        `src/content/${item.slug.startsWith("notes") ? "" : "posts/"}${
          item.slug
        }.md`,
      ).text();
      const content = await parseMarkdown(md);
      return {
        id: `https://blog.zerolimits.dev/${item.slug}`,
        url: `https://blog.zerolimits.dev/${item.slug}`,
        title: item.title,
        content_html: content,
        summary: item.description,
        date_published: new Date(item.date).toISOString(),
        date_modified: new Date(item.lastmod ?? item.date).toISOString(),
        authors: [{ name: item.author.name, url: item.author.link }],
        language: "en",
      };
    }),
  );

  const authors = (await getCollection("authors")).map((author) => ({
    name: author.name,
    url: author.link,
  }));

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "The Blog of Random",
    home_page_url: "https://blog.zerolimits.dev",
    feed_url: "https://blog.zerolimits.dev/feed.json",
    description: "A blog about the most random things you can think of.",
    favicon: "https://blog.zerolimits.dev/favicon.ico",
    authors,
    language: "en",
    items: entries,
  };

  Bun.write("dist/feed.json", JSON.stringify(feed));
}

async function atomFeed() {
  const entries = await Promise.all(
    items.map(async (item) => {
      const md = await Bun.file(
        `src/content/${item.slug.startsWith("notes") ? "" : "posts/"}${
          item.slug
        }.md`,
      ).text();
      const content = await parseMarkdown(md);

      return {
        id: `https://blog.zerolimits.dev/${item.slug}`,
        title: item.title,
        updated: new Date(item.lastmod ?? item.date).toISOString(),
        author: {
          name: item.author.name,
          uri: item.author.link,
        },
        content: Bun.escapeHTML(content),
        link: `https://blog.zerolimits.dev/${item.slug}`,
        summary: item.description,
        published: new Date(item.date).toISOString(),
      };
    }),
  );

  const authors = (await getCollection("authors")).map((author) => ({
    name: author.name,
    uri: author.link,
  }));

  const feed = `
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://blog.zerolimits.dev</id>
  <title>The Blog of Random</title>
  <updated>${new Date(lastUpdate).toISOString()}</updated>
  <link rel="self" href="https://blog.zerolimits.dev/feed.atom" />
  ${authors.map((author) => `<contributor><name>${author.name}</name><uri>${author.uri}</uri></contributor>`).join("")}
  <icon>https://blog.zerolimits.dev/favicon.ico</icon>
  <subtitle>A blog about the most random things you can think of.</subtitle>
  ${entries
    .map((entry) =>
      `
  <entry>
    <id>${entry.id}</id>
    <title>${entry.title}</title>
    <updated>${entry.updated}</updated>
    <author><name>${entry.author.name}</name><uri>${entry.author.uri}</uri></author>
    <content type="html">${entry.content}</content>
    <link rel="alternate" href="${entry.link}" />
    <summary>${entry.summary}</summary>
    <published>${entry.published}</published>
  </entry>
    `.trim(),
    )
    .join("")}
</feed>
    `.trim();

  Bun.write("dist/feed.atom", feed);
}

async function rssFeed() {
  const entries = await Promise.all(
    items.map(async (item) => {
      const md = await Bun.file(
        `src/content/${item.slug.startsWith("notes") ? "" : "posts/"}${
          item.slug
        }.md`,
      ).text();
      const content = await parseMarkdown(md);
      return {
        author: item.author.name,
        description: item.description,
        guid: `https://blog.zerolimits.dev/${item.slug}`,
        link: `https://blog.zerolimits.dev/${item.slug}`,
        pubDate: new Date(item.lastmod ?? item.date).toUTCString(),
        title: item.title,
        content: Bun.escapeHTML(content),
      };
    }),
  );

  const feed = `
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <description>A blog about the most random things you can think of.</description>
    <link>https://blog.zerolimits.dev</link>
    <title>The Blog of Random</title>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <language>en</language>
    <lastBuildDate>${new Date(lastUpdate).toUTCString()}</lastBuildDate>
    <pubDate>${new Date(lastUpdate).toUTCString()}</pubDate>
    <atom:link href="https://blog.zerolimits.dev/feed.rss" rel="self" type="application/rss+xml" />
    ${entries
      .map((entry) =>
        `
      <item>
        <dc:creator>${entry.author}</dc:creator>
        <description>${entry.description}</description>
        <guid>${entry.guid}</guid>
        <link>${entry.link}</link>
        <pubDate>${entry.pubDate}</pubDate>
        <title>${entry.title}</title>
        <content:encoded>${entry.content}</content:encoded>
      </item>
      `.trim(),
      )
      .join("")}
  </channel>
</rss>
`.trim();

  Bun.write("dist/feed.rss", feed);
}

await jsonFeed();
await rssFeed();
await atomFeed();

const html = BaseLayout(
  { title: "Feed - The Blog of Random" },
  {
    default: `
<main>
  <h2>The Blog of Random Feed</h2>
  <p>Simply enter <code>https://blog.zerolimits.dev</code> into your feed reader, it should automatically find and add the feed!</p>
</main>
`,
  },
  { pathname: "/feed" },
);

Bun.write("dist/feed.html", html);
