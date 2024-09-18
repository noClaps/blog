import Znak from "@noclaps/znak";

type AuthorCollection = {
  name: string;
  link: string;
};
type PostsCollection = {
  slug: string;
  title: string;
  description?: string;
  author: AuthorCollection;
  date: Date;
  lastmod?: Date;
  series?: number;
};

type PostsFrontmatter = {
  title: string;
  description?: string;
  author: string;
  date: string;
  lastmod?: string;
  series?: string;
};

function frontmatter(md: string) {
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

  return dataObject as PostsFrontmatter;
}

export async function getCollection(
  name: "authors",
): Promise<AuthorCollection[]>;
export async function getCollection(
  name: "notes" | "posts",
): Promise<PostsCollection[]>;
export async function getCollection(
  name: "authors" | "notes" | "posts",
): Promise<AuthorCollection[] | PostsCollection[]> {
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

      const data: PostsCollection[] = [];
      for (const file of collection) {
        const fm = frontmatter(
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
        const fm = frontmatter(
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

    default:
      throw new Error("Invalid input");
  }
}

export function parseMarkdown(md: string) {
  let mdWithoutFrontmatter = md.replace(/^---([\w:\s\S]*?)---/, "").trim();
  const post = new Znak(mdWithoutFrontmatter);
  return { html: post.renderToHTML(), headings: post.headings() };
}
