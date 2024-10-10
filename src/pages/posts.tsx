import { headings as headingsFn, render } from "@noclaps/znak";
import { getCollection, removeFrontmatter } from "../../scripts/utils";
import Post from "../layouts/Post";

export async function* writePosts() {
	const posts = await getCollection("posts");
	for (const post of posts) {
		const postContent = removeFrontmatter(
			await Bun.file(`src/content/posts/${post.slug}.md`).text(),
		);
		const html = await render(postContent);

		const headings = headingsFn(postContent);

		yield {
			filePath: `${post.slug}.html`,
			post: (
				<Post
					title={post.title}
					description={post.description}
					author={post.author}
					date={post.date}
					lastmod={post.lastmod}
					headings={headings}
					pathname={`/${post.slug}`}
				>
					{html}
				</Post>
			),
		};
	}
}

export async function* writeNotes() {
	const notes = await getCollection("notes");
	for (const note of notes) {
		const noteContent = removeFrontmatter(
			await Bun.file(`src/content/notes/${note.slug}.md`).text(),
		);
		const html = await render(noteContent);
		const headings = headingsFn(noteContent);

		yield {
			filePath: `notes/${note.slug}.html`,
			post: (
				<Post
					title={note.title}
					author={note.author}
					date={note.date}
					lastmod={note.lastmod}
					headings={headings}
					pathname={`/notes/${note.slug}`}
				>
					{html}
				</Post>
			),
		};
	}
}

export async function* writeStories() {
	const stories = await getCollection("stories");
	for (const story of stories) {
		const storyContent = removeFrontmatter(
			await Bun.file(`src/content/stories/${story.slug}.md`).text(),
		);
		const html = await render(storyContent);
		const headings = headingsFn(storyContent);

		yield {
			filePath: `stories/${story.slug}.html`,
			post: (
				<Post
					title={story.title}
					author={story.author}
					headings={headings}
					pathname={`/stories/${story.slug}`}
				>
					{html}
				</Post>
			),
		};
	}
}
