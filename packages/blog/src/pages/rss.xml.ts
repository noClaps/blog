import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");

  return rss({
    title: "The Blog of Random",
    description:
      "A blog about the most random things you can think of.",
    site: context.site!,
    items: posts.map((post) => ({
      link: `/${ post.slug }`,
      title: post.data.title,
      pubDate: post.data.lastmod ? post.data.lastmod : post.data.date,
      description: post.data.description,
    })),
  });
}
