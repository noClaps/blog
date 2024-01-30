import parseMarkdown from "../../tools/markdown"
import { getCollection } from "../../tools/utils"

const postItems = await getCollection("posts")
const noteItems = await getCollection("notes")

for (const item of noteItems) {
	item.slug = `notes/${item.slug}`
}

const items = [...postItems, ...noteItems]

let lastUpdate = 0
for (const item of items) {
	const itemDate = item.lastmod ?? item.date
	if (itemDate > lastUpdate) {
		lastUpdate = itemDate
	}
}

const entries = await Promise.all(items.map(async (item) => {
	const md = await Bun.file(`src/content/${item.slug.startsWith("notes") ? "" : "posts/"}${item.slug}.md`).text()
	const content = await parseMarkdown(md)
	return {
		id: `https://blog.zerolimits.dev/${item.slug}`,
		url: `https://blog.zerolimits.dev/${item.slug}`,
		title: item.title,
		content_html: content,
		summary: item.description,
		date_published: new Date(item.date).toISOString(),
		date_modified: new Date(item.lastmod ?? item.date).toISOString(),
		authors: [{name: item.author.name, url: item.author.link}],
		language: "en"
	}
}))

const authors = (await getCollection("authors")).map(author => ({name: author.name, url: author.link}))

const feed = {
	version: "https://jsonfeed.org/version/1.1",
	title: "The Blog of Random",
	home_page_url: "https://blog.zerolimits.dev",
	feed_url: "https://blog.zerolimits.dev/feed.json",
	description: "A blog about the most random things you can think of.",
	favicon: "https://blog.zerolimits.dev/favicon.ico",
	authors,
	language: "en",
	items: entries
}

Bun.write("dist/feed.json", JSON.stringify(feed))
