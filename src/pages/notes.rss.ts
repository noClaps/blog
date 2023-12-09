import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import Markdoc from "@markdoc/markdoc";

export async function GET(context: APIContext) {
    const notes = await getCollection("notes");

    return rss({
        title: "Notes from The Blog of Random",
        description: "A blog about the most random things you can think of.",
        site: context.site!,
        items: notes.map(note => ({
            link: `/notes/${ note.slug }`,
            title: note.data.title,
            pubDate: note.data.lastmod ?? note.data.date,
            content: Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(note.body))),
            author: note.data.author.id
        }))
    });
}