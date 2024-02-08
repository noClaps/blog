import BaseLayout from "./BaseLayout";
import TableOfContents from "../components/layout/TableOfContents";
import { type Heading } from "../../tools/types";

interface Props {
  title: string;
  description?: string;
  author: {
    name: string;
    link: string;
  };
  date: Date;
  lastmod?: Date;
  headings: Heading[];
}

export default function Post(
  props: Props,
  slots: {
    default: string;
  },
  vals: {
    pathname: string;
  },
) {
  const { title, description, author, date, lastmod, headings } = props;
  const pubDate = lastmod ?? date;

  return BaseLayout(
    { title, description },
    {
      head: `
		<link rel="stylesheet" href="/styles/post.css">
		<link rel="stylesheet" href="/styles/components.css">
		<script src="/post-components.js" defer></script>
		<script src="/mathjax/tex-svg.js" async type="module"></script>
		`,
      header:
        headings.length > 0
          ? `<details>
				<summary>Table of Contents</summary>
				${TableOfContents({ headings: headings })}
				</details>`
          : "",
      default: `
		<div class="content">
		${
      headings.length > 0
        ? `<div class="toc">
				<h3>Table of Contents</h3>
				${TableOfContents({ headings: headings })}
				</div>`
        : ""
    }
		<main>
		<div class="post-header">
		<time datetime="${pubDate.toISOString()}">
		${pubDate.toDateString()}
		</time>
		<h1>${title}</h1>
		<div class="post-info">
		${description ? `<h3 class="description">${description}</h3>` : ""}
		<p class="author">
		Written by <a class="author-link" href="${author.link}"
		>${author.name}</a
		>
		</p>
		</div>
		</div>
		<article>
		${slots.default}
		</article>
		</main>
		</div>
		`,
    },
    { pathname: vals.pathname },
  );
}
