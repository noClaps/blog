import { render } from "@noclaps/znak";
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

Bun.serve({
  routes: {
    "/": new Response(buildHtml(indexPage), {
      headers: { "Content-Type": "text/html" },
    }),
    "/feed": new Response(buildHtml(feedPage), {
      headers: { "Content-Type": "text/html" },
    }),
    "/feed.rss": new Response(rssFeed, {
      headers: { "Content-Type": "application/rss+xml" },
    }),
    "/feed.atom": new Response(atomFeed, {
      headers: { "Content-Type": "application/atom+xml" },
    }),
    "/feed.json": Response.json(jsonFeed),
    "/_assets/src/content/:section/:post/:asset": ({
      params: { section, post, asset },
    }) => new Response(Bun.file(`src/content/${section}/${post}/${asset}`)),
    "/edit/:section/:post": async ({ params: { section, post } }) =>
      new Response(Bun.file(`src/content/${section}/${post}.md`)),
    "/render/:section/:post": {
      async POST(req) {
        const { section, post } = req.params;
        const input = await req.text();
        Bun.write(`src/content/${section}/${post}.md`, input);

        return new Response(buildPostFromText(input, `${post.slice(1)}.html`));
      },
    },
    "/:section/:post": async ({ params: { section, post } }) => {
      const pages: { [filepath: string]: string } = {};

      for (const { filePath, post } of writePosts()) {
        pages[filePath] = buildPost(post, filePath);
      }

      if (`${section}/${post}.html` in pages) {
        return new Response(pages[`${section}/${post}.html`], {
          headers: { "Content-Type": "text/html" },
        });
      }
      return Response.error();
    },
    "/**": ({ url }) => {
      const path = new URL(url).pathname;
      if (fs.existsSync(`public${path}`)) {
        return new Response(Bun.file(`public${path}`));
      }
      return Response.error();
    },
  },
});
