import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import Markdoc from "@markdoc/markdoc";

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
            pubDate: post.data.lastmod ?? post.data.date,
            description: post.data.description,
            content: Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(post.body))),
            author: post.data.author.id
        })),
    });
}