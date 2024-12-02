import { render } from "@noclaps/znak";
import {
  codeTheme,
  getCollection,
  removeFrontmatter,
} from "../../scripts/utils.ts";
import Post from "../layouts/Post.ts";

export async function writePosts(collection: "notes" | "posts" | "stories") {
  const posts = await getCollection(collection);
  return posts.map(async (post) => {
    const postContent = removeFrontmatter(
      await Bun.file(`src/content/${post.slug}.md`).text(),
    );
    const html = await render(postContent, codeTheme);

    return {
      filePath: `${post.slug}.html`,
      post: Post({
        title: post.title,
        description: post.description,
        date: post.date,
        lastmod: post.lastmod,
        children: html,
      }),
    };
  });
}
