import { render } from "@noclaps/znak";
import { codeTheme, getPosts } from "../../scripts/utils.ts";
import Post from "../layouts/Post.ts";

export async function writePosts() {
  const posts = await getPosts();
  return Promise.all(
    posts.map(async (post) => {
      const html = await render(post.content, codeTheme);
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
    }),
  );
}
