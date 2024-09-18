import { getCollection, parseMarkdown } from "../../scripts/utils";
import Post from "../layouts/Post";

const posts = await getCollection("posts");
const notes = await getCollection("notes");

for (const post of posts) {
  const { html, headings } = parseMarkdown(
    await Bun.file(`src/content/posts/${post.slug}.md`).text(),
  );

  Bun.write(
    `dist/${post.slug}.html`,
    Post(
      {
        title: post.title,
        description: post.description,
        author: post.author,
        date: post.date,
        lastmod: post.lastmod,
        headings,
      },
      html,
      `/${post.slug}`,
    ),
  );
}

for (const note of notes) {
  const { html, headings } = parseMarkdown(
    await Bun.file(`src/content/notes/${note.slug}.md`).text(),
  );

  Bun.write(
    `./dist/notes/${note.slug}.html`,
    Post(
      {
        title: note.title,
        author: note.author,
        date: note.date,
        lastmod: note.lastmod,
        headings,
      },
      html,
      `/notes/${note.slug}`,
    ),
  );
}
