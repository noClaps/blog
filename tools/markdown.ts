import { headings } from "./markdown/headings";
import { frontmatter } from "./markdown/frontmatter";
import { hr } from "./markdown/horizontal-rule";
import { bold, italic, strikethrough, subscript, superscript, mark } from "./markdown/formatting";
import { table, tableHeading, tableBody } from "./markdown/tables";
import { codeBlock, inlineCode } from "./markdown/code";
import { images } from "./markdown/images";
import { hyperlink } from "./markdown/hyperlink";
import { blockquote } from "./markdown/blockquote";
import { checklist, ul, ol, li } from "./markdown/lists";
import { paragraph } from "./markdown/paragraph";

export default function parseMarkdown(md: string) {
	const frontmatterRegex = /^---([\w:\s\S]*?)---/;

	// Frontmatter
	const postData = frontmatter(frontmatterRegex, md)
	md = md.replace(frontmatterRegex, "").trim()

	// Headings
	md = headings(md, 1)
	md = headings(md, 2)
	md = headings(md, 3)
	md = headings(md, 4)
	md = headings(md, 5)
	md = headings(md, 6)

	// Horizontal rule
	md = hr(md)

	// Formatting
	md = bold(md)
	md = italic(md)
	md = strikethrough(md)
	md = subscript(md)
	md = superscript(md)
	md = mark(md)

	// Tables
	md = table(md)
	md = tableHeading(md)
	md = tableBody(md)

	// Code
	md = codeBlock(md)
	md = inlineCode(md)

	// Images
	md = images(md)

	// Hyperlinks
	md = hyperlink(md)

	// Blockquotes
	md = blockquote(md)

	// Lists
	md = checklist(md)
	md = ul(md)
	md = ol(md)

	let attempt = 1;
	while (md.match(/\s*(-|\d\.)\s(.*)/gm) && attempt <= 2) {
		md = li(md, attempt)
		attempt++;
	}

	// Paragraph
	md = paragraph(md)

	return { html: md, postData }
}
