import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

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
            content: sanitizeHtml(parser.render(note.body)),
            author: note.data.author.id
        }))
    });
}