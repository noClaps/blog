/** This was taken from Astro's MarkdownHeading type */
type Heading = {
	depth: number;
	slug: string;
	title: string;
};

interface HeadingTree extends Heading {
	subheadings: HeadingTree[];
}

function TableOfContents(headings: Heading[], nested: boolean = false) {
	// @ts-ignore I can't be bothered to do the type gymnastics for this
	const toc: HeadingTree[] = nested ? headings : [];
	if (!nested) {
		const parentHeadings = new Map();
		for (const h of headings) {
			const heading = { ...h, subheadings: [] };
			parentHeadings.set(heading.depth, heading);

			if (heading.depth === 2) {
				toc.push(heading);
			} else if (heading.depth <= 3) {
				parentHeadings.get(heading.depth - 1).subheadings.push(heading);
			}
		}
	}

	return (
		<ul class="table-of-contents">
			{toc.map(({ subheadings, slug, title }) => (
				<li>
					<a href={`#${slug}`}>{title}</a>
					{subheadings.length > 0 ? TableOfContents(subheadings, true) : ""}
				</li>
			))}
		</ul>
	);
}

export default function Post(
	props: {
		title: string;
		description?: string;
		author: {
			name: string;
			link: string;
		};
		date?: Date;
		lastmod?: Date;
		headings: Heading[];
	},
	slot: string,
	pathname: string,
) {
	const {
		title,
		description = "A blog about the most random things you can think of.",
		author,
		date,
		lastmod,
		headings,
	} = props;
	const pubDate = lastmod ?? date;

	return (
		<>
			{`<!doctype html>`}
			<html lang="en">
				<head>
					<link rel="icon" href="/favicon.ico" />
					<title>{title}</title>
					<meta charset="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<meta name="description" content={description} />
					<link
						href="https://api.fontshare.com/v2/css?f[]=switzer@2,1&display=swap"
						rel="stylesheet"
					/>
					<link
						rel="alternate"
						href="/feed.json"
						type="application/json"
						title="Feed"
					/>
					<link
						rel="alternate"
						href="/feed.atom"
						type="application/atom+xml"
						title="Feed"
					/>
					<link
						rel="alternate"
						href="/feed.rss"
						type="application/rss+xml"
						title="Feed"
					/>
					<link rel="stylesheet" href="/styles/global.css" />
					<link rel="stylesheet" href="/styles/post.css" />
					<link
						rel="stylesheet"
						href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
						integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
						crossorigin="anonymous"
					/>
				</head>
				<body>
					<header>
						{pathname !== "/" && pathname !== "/notes" ? (
							<div>
								<a
									class="home"
									href={pathname.startsWith("/notes") ? "/notes" : "/"}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-home"
									>
										<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
										<polyline points="9 22 9 12 15 12 15 22" />
									</svg>
								</a>
								{headings.length > 0 ? (
									<details>
										<summary>Table of Contents</summary>
										{TableOfContents(headings)}
									</details>
								) : (
									<div />
								)}
							</div>
						) : (
							<div />
						)}
						<a class="feed" href="/feed" title="Feed">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-rss"
							>
								<path d="M4 11a9 9 0 0 1 9 9"></path>
								<path d="M4 4a16 16 0 0 1 16 16"></path>
								<circle cx="5" cy="19" r="1"></circle>
							</svg>
						</a>
					</header>
					<div class="content">
						{headings.length > 0 ? (
							<div class="toc">
								<h3>Table of Contents</h3>
								{TableOfContents(headings)}
							</div>
						) : (
							""
						)}
						<main>
							<div class="post-header">
								{pubDate && (
									<time datetime={pubDate.toISOString()}>
										{pubDate.toDateString()}
									</time>
								)}
								<h1>{title}</h1>
								<div class="post-info">
									{description !==
									"A blog about the most random things you can think of." ? (
										<h3 class="description">{description}</h3>
									) : (
										""
									)}
									<p class="author">
										Written by{" "}
										<a class="author-link" href={author.link}>
											{author.name}
										</a>
									</p>
								</div>
							</div>
							<article>{slot}</article>
						</main>
					</div>
				</body>
			</html>
		</>
	).toString();
}
