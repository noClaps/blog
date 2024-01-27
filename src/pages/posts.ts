import parseMarkdown from "../../tools/markdown";
import { getCollection, headings } from "../../tools/utils";
import Post from "../layouts/Post";

const posts = await getCollection("posts")

for (const post of posts) {
	const renderedPost = await parseMarkdown(await Bun.file(`src/content/posts/${post.slug}.md`).text())
	const postHeadings = headings(renderedPost)

	Bun.write(
		`dist/${post.slug}/index.html`,
		Post(
			{
				title: post.title,
				description: post.description,
				author: post.author,
				date: post.date,
				lastmod: post.lastmod,
				headings: postHeadings
			},
			{
				default: renderedPost	
			},
			{
				pathname: `/${post.slug}`
			}
		)
	)
}
