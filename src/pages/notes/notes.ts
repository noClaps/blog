import parseMarkdown from "../../../tools/markdown";
import { getCollection, headings } from "../../../tools/utils";
import Post from "../../layouts/Post";

const notes = await getCollection("notes")

for (const note of notes) {
	const rendered = await parseMarkdown(await Bun.file(`src/content/notes/${note.slug}.md`).text())
	const noteHeadings = headings(rendered)

	Bun.write(
		`./dist/notes/${note.slug}.html`,
		Post(
			{
				title: note.title,
				author: note.author,
				date: note.date,
				lastmod: note.lastmod,
				headings: noteHeadings
			},
			{
				default: rendered
			},
			{
				pathname: `/notes/${note.slug}`
			}
		)
	)
}
