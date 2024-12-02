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
  tokenColors: [
    {
      scope: "variable",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      scope: "variable.other.readwrite",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      scope: "entity.name.variable",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      scope: "variable.other.property",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      scope: "variable.parameter",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      scope: "variable.other.constant.property",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      scope: "variable.language",
      settings: {
        foreground: "#ffffff",
      },
    },
    {
      scope: "entity.name.function",
      settings: {
        foreground: "#66d4cf",
      },
    },
    {
      scope: "entity.name.type",
      settings: {
        foreground: "#66d4cf",
      },
    },
    {
      scope: "entity.name.section",
      settings: {
        foreground: "#66d4cf",
      },
    },
    {
      scope: "support.function",
      settings: {
        foreground: "#66d4cf",
      },
    },
    {
      scope: "support.type.property-name.css",
      settings: {
        foreground: "#66d4cf",
      },
    },
    {
      scope: "keyword",
      settings: {
        foreground: "#ff375f",
      },
    },
    {
      scope: "keyword.control",
      settings: {
        foreground: "#ff375f",
      },
    },
    {
      scope: "keyword.other",
      settings: {
        foreground: "#ff375f",
      },
    },
    {
      scope: "keyword.declaration",
      settings: {
        foreground: "#ff375f",
      },
    },
    {
      scope: "storage.type",
      settings: {
        foreground: "#ff375f",
      },
    },
    {
      scope: "storage.modifier",
      settings: {
        foreground: "#ff375f",
      },
    },
    {
      scope: "entity.name.tag",
      settings: {
        foreground: "#ff375f",
      },
    },
    {
      scope: "support.type",
      settings: {
        foreground: "#ff375f",
      },
    },
    {
      scope: "entity.name.tag.css",
      settings: {
        foreground: "#ff375f",
      },
    },
    {
      scope: "comment",
      settings: {
        foreground: "#98989d",
      },
    },
    {
      scope: "comment.line",
      settings: {
        foreground: "#98989d",
      },
    },
    {
      scope: "comment.block",
      settings: {
        foreground: "#98989d",
      },
    },
    {
      scope: "punctuation",
      settings: {
        foreground: "#98989d",
      },
    },
    {
      scope: "keyword.operator",
      settings: {
        foreground: "#98989d",
      },
    },
    {
      scope: "punctuation.definition.array.begin",
      settings: {
        foreground: "#98989d",
      },
    },
    {
      scope: "punctuation.definition.array.end",
      settings: {
        foreground: "#98989d",
      },
    },
    {
      scope: "punctuation.section.brackets.begin",
      settings: {
        foreground: "#98989d",
      },
    },
    {
      scope: "punctuation.section.brackets.end",
      settings: {
        foreground: "#98989d",
      },
    },
    {
      scope: "constant",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "constant.character",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "constant.language",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "constant.other",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "entity.name.type.class",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "support.class",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "variable.other.constant",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "support.constant.*",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "entity.other.inherited-class",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "entity.other.attribute-name.class.css",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "entity.other.attribute-name.id.css",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "entity.other.attribute-name.pseudo-class.css",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "entity.other.attribute-name.pseudo-element.css",
      settings: {
        foreground: "#6ac4dc",
      },
    },
    {
      scope: "constant.numeric",
      settings: {
        foreground: "#ffd60a",
      },
    },
    {
      scope: "support.constant.property-value.css",
      settings: {
        foreground: "#ffd60a",
      },
    },
    {
      scope: "constant.other.color",
      settings: {
        foreground: "#ffd60a",
      },
    },
    {
      scope: "constant.other.color.rgb-value.css",
      settings: {
        foreground: "#ffd60a",
      },
    },
    {
      scope: "string",
      settings: {
        foreground: "#ff9f0a",
      },
    },
  ],
};
