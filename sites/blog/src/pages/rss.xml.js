import rss from '@astrojs/rss';
import { getCollection } from "astro:content";

export async function get(context) {
  const posts = await getCollection("posts")

  return rss({
    title: 'The Blog of Random',
    description: "A blog about the most random things you can think of, brought to you by the most interesting boring person you've ever met.",
    site: context.site,
    items: posts.map((post) => ({
      link: `/${post.slug}`,
      title: post.data.title,
      pubDate: (post.data.lastmod ? post.data.lastmod : post.data.date),
      description: post.data.description
    })),
    stylesheet: '/rss.xsl'
  });
}
