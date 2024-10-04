export default function Link(props: {
	title: string;
	description?: string;
	href: string;
	date?: Date;
	author: string;
}) {
	const { title, description, href, date, author } = props;

	return (
		<a class="link" href={`/${href}`}>
			{date && <time datetime={date.toISOString()}>{date.toDateString()}</time>}
			<h4>{title}</h4>
			{description ? <p>{description}</p> : ""}
			<p>Written by {author}</p>
		</a>
	);
}
