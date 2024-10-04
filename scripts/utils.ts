import Znak from "@noclaps/znak";

type AuthorCollection = {
	name: string;
	link: string;
};
export type PostsCollection = {
	slug: string;
	title: string;
	description: string;
	author: AuthorCollection;
	date: Date;
	lastmod?: Date;
	series?: number;
};
export type NotesCollection = {
	slug: string;
	title: string;
	author: AuthorCollection;
	date: Date;
	lastmod?: Date;
};
export type StoriesCollection = {
	slug: string;
	title: string;
	author: AuthorCollection;
};

type PostsFrontmatter = {
	title: string;
	description: string;
	author: string;
	date: string;
	lastmod?: string;
	series?: string;
};

type NotesFrontmatter = {
	title: string;
	author: string;
	date: string;
	lastmod?: string;
};

type StoriesFrontmatter = {
	title: string;
	author: string;
};

function frontmatter<
	T = PostsFrontmatter | NotesFrontmatter | StoriesFrontmatter,
>(md: string) {
	const frontmatterRegex = md.match(/^---([\w:\s\S]*?)---/);
	if (!frontmatterRegex) throw new Error("Frontmatter not found");

	let frontmatter = frontmatterRegex[0];

	frontmatter = frontmatter.replaceAll(/\n?---\n?/g, "");
	const frontmatterData = frontmatter
		.split("\n")
		.map((str) => str.split(/:\s?/));

	const dataObject: { [key: string]: string } = {};
	for (let data of frontmatterData) {
		data = data.map((i) => i.replaceAll(`"`, ""));
		dataObject[data[0]] = data.slice(1).join(": ");
	}

	return dataObject as T;
}

export async function getCollection(
	name: "authors",
): Promise<AuthorCollection[]>;
export async function getCollection(name: "notes"): Promise<NotesCollection[]>;
export async function getCollection(name: "posts"): Promise<PostsCollection[]>;
export async function getCollection(
	name: "stories",
): Promise<StoriesCollection[]>;
export async function getCollection(
	name: "authors" | "notes" | "posts" | "stories",
) {
	switch (name) {
		case "authors": {
			const collection = new Bun.Glob("*.json").scanSync({
				cwd: "src/content/authors",
			});
			const data: AuthorCollection[] = [];
			for (const file of collection) {
				data.push(await Bun.file(`src/content/authors/${file}`).json());
			}
			return data;
		}

		case "notes": {
			const collection = new Bun.Glob("**/*.md").scanSync({
				cwd: "src/content/notes",
			});

			const data: NotesCollection[] = [];
			for (const file of collection) {
				const fm = frontmatter<NotesFrontmatter>(
					await Bun.file(`src/content/notes/${file}`).text(),
				);
				const author = (await getCollection("authors")).find(
					(i) => i.name === fm.author,
				);
				if (!author) throw new Error(`Author for ${file} not found`);

				data.push({
					slug: file.replace(".md", ""),
					title: fm.title,
					author,
					date: new Date(fm.date),
					lastmod: fm.lastmod ? new Date(fm.lastmod) : undefined,
				});
			}
			return data;
		}

		case "posts": {
			const collection = new Bun.Glob("**/*.md").scanSync({
				cwd: "src/content/posts",
			});

			const data: PostsCollection[] = [];
			for (const file of collection) {
				const fm = frontmatter<PostsFrontmatter>(
					await Bun.file(`src/content/posts/${file}`).text(),
				);
				const author = (await getCollection("authors")).find(
					(i) => i.name === fm.author,
				);
				if (!author) throw new Error(`Author for ${file} not found`);

				data.push({
					slug: file.replace(".md", ""),
					title: fm.title,
					description: fm.description,
					author,
					date: new Date(fm.date),
					lastmod: fm.lastmod ? new Date(fm.lastmod) : undefined,
					series: fm.series ? Number.parseInt(fm.series) : undefined,
				});
			}

			return data;
		}

		case "stories": {
			const collection = new Bun.Glob("**/*.md").scanSync({
				cwd: "src/content/stories",
			});

			const data: StoriesCollection[] = [];
			for (const file of collection) {
				const fm = frontmatter<StoriesFrontmatter>(
					await Bun.file(`src/content/stories/${file}`).text(),
				);
				const author = (await getCollection("authors")).find(
					(i) => i.name === fm.author,
				);
				if (!author) throw new Error(`Author for ${file} not found`);

				data.push({
					slug: file.replace(".md", ""),
					title: fm.title,
					author,
				});
			}

			return data;
		}

		default:
			throw new Error("Invalid input");
	}
}

export function parseMarkdown(md: string) {
	let mdWithoutFrontmatter = md.replace(/^---([\w:\s\S]*?)---/, "").trim();
	const post = new Znak(mdWithoutFrontmatter);
	return { html: post.renderToHTML(), headings: post.headings() };
}
