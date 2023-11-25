import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const blog = await getCollection("posts");
  const notes = await getCollection("notes");
  const posts = [...blog.map((post) => ({
    link: `/${ post.slug }`,
    title: post.data.title,
    pubDate: post.data.lastmod ?? post.data.date,
    description: post.data.description,
    content: sanitizeHtml(parser.render(post.body)),
    author: post.data.author.id
  })), ...notes.map((post) => ({
    link: `/${ post.slug }`,
    title: post.data.title,
    pubDate: post.data.lastmod ?? post.data.date,
    content: sanitizeHtml(parser.render(post.body)),
    author: post.data.author.id
  }))];

  return rss({
    title: "The Blog of Random",
    description:
      "A blog about the most random things you can think of.",
    site: context.site!,
    items: posts,
  });
}
