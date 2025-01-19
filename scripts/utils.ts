import type { CodeTheme } from "@noclaps/znak";

export interface Post {
  slug: string;
  title: string;
  description?: string;
  date: Date;
  lastmod?: Date;
  content: string;
}

type Frontmatter = {
  title: string;
  description?: string;
  date: string;
  lastmod?: string;
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

  return dataObject as Frontmatter;
}

export async function getPosts() {
  const collection = new Bun.Glob("**/*.md").scanSync({
    cwd: `src/content/`,
  });
  const data: Post[] = [];
  for (const file of collection) {
    const fileContent = await Bun.file(`src/content/${file}`).text();
    const fm = frontmatter(fileContent);
    const postContent = fileContent.replace(/^---([\w:\s\S]*?)---/, "").trim();

    data.push({
      slug: file.replace(".md", ""),
      title: fm.title,
      date: new Date(fm.date),
      description: fm.description,
      lastmod: fm.lastmod ? new Date(fm.lastmod) : undefined,
      content: postContent,
    });
  }
  return data;
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

// Template functions
export function html(strings: TemplateStringsArray, ...values: any[]) {
  let output = "";
  for (let i = 0; i < strings.length; i++) {
    const miniString = strings[i]
      .replaceAll(/>\s+</g, "><")
      .replaceAll(/\s+/g, " ");
    output += miniString;
    if (values[i]) output += values[i].toString().trim();
  }
  return output;
}

// Zerolimits code theme
export const codeTheme: CodeTheme = {
  bg: "#111",
  fg: "#fff",
  highlights: {
    attribute: {
      color: "#ac8e68",
      fontWeight: 500,
    },
    boolean: {
      color: "#ff375f",
      fontWeight: 700,
    },
    comment: {
      color: "#98989d",
      fontWeight: 500,
    },
    "comment.doc": {
      color: "#98989d",
    },
    constant: {
      color: "#6ac4dc",
      fontWeight: 500,
    },
    constructor: {
      color: "#66d4cf",
      fontWeight: 500,
    },
    enum: {
      color: "#66d4cf",
      fontWeight: 500,
    },
    emphasis: {
      color: "#5ac8f5",
      fontStyle: "italic",
    },
    "emphasis.strong": {
      color: "#5ac8f5",
      fontWeight: 700,
    },
    function: {
      color: "#66d4cf",
      fontWeight: 500,
    },
    keyword: {
      color: "#ff375f",
      fontWeight: 700,
    },
    label: {
      color: "#98989d",
      fontWeight: 700,
    },
    "link.text": {
      color: "#0a84ff",
      fontWeight: 500,
    },
    "link.uri": {
      color: "#0a84ff",
      fontWeight: 500,
    },
    link_text: {
      color: "#ff9f0a",
      fontWeight: 500,
    },
    link_uri: {
      color: "#0a84ff",
      fontWeight: 500,
    },
    number: {
      color: "#ffd60a",
      fontWeight: 500,
    },
    operator: {
      color: "#98989d",
      fontWeight: 500,
    },
    preproc: {
      color: "#ff9f0a",
      fontWeight: 500,
    },
    property: {
      color: "#6ac4dc",
      fontWeight: 500,
    },
    "punctuation.bracket": {
      color: "#98989d",
      fontWeight: 500,
    },
    "punctuation.list_marker": {
      color: "#ac8e68",
      fontWeight: 500,
    },
    string: {
      color: "#ff9f0a",
      fontWeight: 500,
    },
    "string.special": {
      color: "#ff9f0a",
      fontWeight: 500,
    },
    "string.special.symbol": {
      color: "#ffd60a",
      fontWeight: 500,
    },
    tag: {
      color: "#ff375f",
      fontWeight: 700,
    },
    "text.literal": {
      color: "#ff9f0a",
      fontWeight: 500,
    },
    title: {
      color: "#98989d",
      fontWeight: 700,
    },
    type: {
      color: "#5ac8f5",
      fontWeight: 500,
    },
    "type.builtin": {
      color: "#5ac8f5",
      fontWeight: 500,
    },
    variable: {
      color: "#fff",
      fontWeight: 500,
    },
  },
};
