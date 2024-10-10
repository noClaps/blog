import { headings as headingsFn, render } from "@noclaps/znak";
import { getCollection, removeFrontmatter } from "../../scripts/utils";
import Post from "../layouts/Post";

export async function writePosts() {
	const posts = await getCollection("posts");
	for (const post of posts) {
		const postContent = removeFrontmatter(
			await Bun.file(`src/content/posts/${post.slug}.md`).text(),
		);
		const html = await render(postContent);

		const headings = headingsFn(postContent);

		Bun.write(
			`dist/${post.slug}.html`,
			Post(
				{
					title: post.title,
					description: post.description,
					author: post.author,
					date: post.date,
					lastmod: post.lastmod,
					headings,
				},
				html,
				`/${post.slug}`,
			),
		);
	}
}

export async function writeNotes() {
	const notes = await getCollection("notes");
	for (const note of notes) {
		const noteContent = removeFrontmatter(
			await Bun.file(`src/content/notes/${note.slug}.md`).text(),
		);
		const html = await render(noteContent);
		const headings = headingsFn(noteContent);

		Bun.write(
			`./dist/notes/${note.slug}.html`,
			Post(
				{
					title: note.title,
					author: note.author,
					date: note.date,
					lastmod: note.lastmod,
					headings,
				},
				html,
				`/notes/${note.slug}`,
			),
		);
	}
}

export async function writeStories() {
	const stories = await getCollection("stories");
	for (const story of stories) {
		const storyContent = removeFrontmatter(
			await Bun.file(`src/content/stories/${story.slug}.md`).text(),
		);
		const html = await render(storyContent);
		const headings = headingsFn(storyContent);

		Bun.write(
			`./dist/stories/${story.slug}.html`,
			Post(
				{
					title: story.title,
					author: story.author,
					headings,
				},
				html,
				`/stories/${story.slug}`,
			),
		);
	}
}
