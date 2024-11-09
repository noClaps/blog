export interface PostsCollection {
  slug: string;
  title: string;
  description?: string;
  date: Date;
  lastmod?: Date;
  series?: number;
}

type PostsFrontmatter = {
  title: string;
  description?: string;
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

export async function getCollection(name: "notes" | "posts" | "stories") {
  switch (name) {
    case "notes": {
      const collection = new Bun.Glob("**/*.md").scanSync({
        cwd: "src/content/notes",
      });

      const data: PostsCollection[] = [];
      for (const file of collection) {
        const fm = frontmatter(
          await Bun.file(`src/content/notes/${file}`).text(),
        );

        data.push({
          slug: file.replace(".md", ""),
          title: fm.title,
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

        data.push({
          slug: file.replace(".md", ""),
          title: fm.title,
          description: fm.description,
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

      const data: PostsCollection[] = [];
      for (const file of collection) {
        const fm = frontmatter(
          await Bun.file(`src/content/stories/${file}`).text(),
        );

        data.push({
          slug: file.replace(".md", ""),
          title: fm.title,
          date: new Date(fm.date),
          lastmod: fm.lastmod ? new Date(fm.lastmod) : undefined,
        });
      }

      return data;
    }

    default:
      throw new Error("Invalid input");
  }
}

export function removeFrontmatter(md: string) {
  return md.replace(/^---([\w:\s\S]*?)---/, "").trim();
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

// Template functions
export function html(strings: TemplateStringsArray, ...values: any[]) {
  let output = "";
  for (let i = 0; i < strings.length; i++) {
    const miniString = strings[i]
      .split("\n")
      .map((l) => l.trim())
      .join(" ")
      .trim()
      .replaceAll("> <", "><");
    output += miniString;
    if (values[i]) output += values[i].toString().trim();
  }
  return output;
}
