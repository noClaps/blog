import { render } from "@noclaps/znak";
import { getCollection, removeFrontmatter } from "../../scripts/utils.ts";
import Post from "../layouts/Post.ts";

export async function writePosts(collection: "notes" | "posts" | "stories") {
  const posts = await getCollection(collection);
  return posts.map(async (post) => {
    const postContent = removeFrontmatter(
      await Bun.file(`src/content/${collection}/${post.slug}.md`).text(),
    );
    const html = await render(postContent);

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
