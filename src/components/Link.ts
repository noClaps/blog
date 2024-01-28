interface Props {
	title: string;
	description?: string;
	href: string;
	date: Date;
	author: string;
}

export default function Link(
	props: Props
) {
	const {title, description, href, date, author} = props

	return `
<a class="link" href=${`/${href}`}>
  <time datetime=${date.toISOString()}>${date.toDateString()}</time>
  <h4>${title}</h4>
  ${description ? `<p>${description}</p>` : ""}
  <p>Written by ${author}</p>
</a>
	`
}
