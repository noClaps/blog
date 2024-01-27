import { type Heading } from "../../../tools/types";

interface Props {
	headings: Heading[];
	nested?: boolean;
}

interface HeadingTree extends Heading {
	subheadings: HeadingTree[]
}

export default function TableOfContents(
	props: Props
) {
	const {headings, nested = false} = props

	// @ts-ignore I can't be bothered to do the type gymnastics for this
	const toc: HeadingTree[] = nested ? headings : [];
	if (!nested) {
		const parentHeadings = new Map();
		headings.forEach((h) => {
			const heading = { ...h, subheadings: [] };
			parentHeadings.set(heading.depth, heading);

			if (heading.depth === 2) {
				toc.push(heading);
			} else if (heading.depth <= 3) {
				parentHeadings.get(heading.depth - 1).subheadings.push(heading);
			}
		});
	}

	return `
<ul class="table-of-contents">
    ${
        toc.map(({ subheadings, slug, title }): string => (
            `<li>
                <a href=${`#${slug}`}>${title}</a>
                ${subheadings.length > 0 ? TableOfContents({headings: subheadings, nested: true}) : ""}
            </li>`
        )).join("")
    }
</ul>
`
}
