import { render } from "@noclaps/znak";
import type { ServeOptions } from "bun";
import fs from "node:fs";
import { atomFeed, feedPage, jsonFeed, rssFeed } from "../src/pages/feed.ts";
import { indexPage } from "../src/pages/index.ts";
import { writePosts } from "../src/pages/posts.ts";
import { buildHtml, buildPost } from "./build.ts";
import { codeTheme, formatDate, frontmatter, html } from "./utils.ts";

interface PostProps {
  title: string;
  description?: string;
  date: Date;
  lastmod?: Date;
  children: string;
}
function PostPartial(props: PostProps) {
  const { title, description, date, lastmod, children } = props;
  const pubDate = lastmod ?? date;

  return html`<div class="post-header">
      <time datetime="${pubDate.toISOString()}"> ${formatDate(pubDate)} </time>
      <h1>${title}</h1>
      ${description && `<p class="description">${description}</p>`}
    </div>
    <article>${children}</article>`;
}

function buildPostFromText(md: string, slug: string) {
  const fm = frontmatter(md);
  const postContent = md.replace(/^---([\w:\s\S]*?)---/, "").trim();
  const data = {
    slug,
    title: fm.title,
    date: new Date(fm.date),
    description: fm.description,
    lastmod: fm.lastmod ? new Date(fm.lastmod) : undefined,
    content: postContent,
  };
  const html = render(postContent, codeTheme);
  const filePath = `${data.slug}.html`;
  const post = PostPartial({
    title: data.title,
    description: data.description,
    date: data.date,
    lastmod: data.lastmod,
    children: html,
  });
  return buildPost(post, filePath);
}

const options: ServeOptions = {
  async fetch(req) {
    const path = new URL(req.url).pathname;

    const pages: { [filepath: string]: string } = {
      "index.html": buildHtml(indexPage()),
      "feed.html": buildHtml(feedPage()),
      "feed.rss": rssFeed(),
      "feed.atom": atomFeed(),
      "feed.json": jsonFeed(),
    };

    for (const { filePath, post } of writePosts()) {
      pages[filePath] = buildPost(post, filePath);
    }

    if (path === "/") {
      return new Response(pages["index.html"], {
        headers: { "Content-Type": "text/html" },
      });
    }
    if (path === "/feed") {
      return new Response(pages["feed.html"], {
        headers: { "Content-Type": "text/html" },
      });
    }
    if (path === "/feed.rss") {
      return new Response(pages["feed.rss"], {
        headers: { "Content-Type": "application/rss+xml" },
      });
    }
    if (path === "/feed.atom") {
      return new Response(pages["feed.atom"], {
        headers: { "Content-Type": "application/atom+xml" },
      });
    }
    if (path === "/feed.json") {
      return new Response(pages["feed.json"], {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (`${path.slice(1)}.html` in pages) {
      return new Response(pages[`${path.slice(1)}.html`], {
        headers: { "Content-Type": "text/html" },
      });
    }
    if (path.startsWith("/_assets")) {
      return new Response(Bun.file(path.replace("/_assets/", "./")));
    }

    if (fs.existsSync(`public${path}`)) {
      return new Response(Bun.file(`public${path}`));
    }

    if (path.startsWith("/edit")) {
      const post = path.replace("/edit", "");
      const postFile = await Bun.file(`src/content${post}.md`).text();
      return new Response(postFile);
    }

    if (path.startsWith("/render")) {
      const post = path.replace("/render", "");
      const input = await req.text();

      Bun.write(`src/content${post}.md`, input);

      return new Response(buildPostFromText(input, `${post.slice(1)}.html`));
    }

    return new Response("Not found", { status: 404 });
  },
};

const server = Bun.serve(options);

console.log(`Server started at: ${server.url}`);

fs.watch("src", { recursive: true }, (event, filename) => {
  console.log(`Detected ${event} on ${filename}`);
  server.reload(options);
  console.log("Reloaded.");
});
