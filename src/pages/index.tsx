import { getCollection } from "../../scripts/utils";

function Link(props: {
	title: string;
	description?: string;
	href: string;
	date: Date;
	author: string;
}) {
	const { title, description, href, date, author } = props;

	return (
		<a class="link" href={`/${href}`}>
			<time datetime={date.toISOString()}>{date.toDateString()}</time>
			<h4>{title}</h4>
			{description ? <p>{description}</p> : ""}
			<p>Written by {author}</p>
		</a>
	);
}

async function Topic(section: string) {
	const posts = await getCollection("posts").then((posts) => {
		return posts.sort((a, b) => {
			if (a.series && b.series) {
				if (a.series > b.series) return 1;
				if (a.series < b.series) return -1;
				return 0;
			}

			const aDate = a.lastmod ?? a.date;
			const bDate = b.lastmod ?? b.date;

			if (aDate > bDate) return -1;
			if (aDate < bDate) return 1;
			return 0;
		});
	});

	return (
		<div class="topic">
			<h2>{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
			<div class="posts">
				{section !== "tech" ? (
					<section>
						{posts.map((post) =>
							post.slug.startsWith(section) ? (
								<Link
									title={post.title}
									description={post.description}
									href={post.slug}
									date={post.lastmod ?? post.date}
									author={post.author.name}
								/>
							) : (
								""
							),
						)}
					</section>
				) : (
					""
				)}
				{section === "tech" ? (
					<>
						<section>
							{posts.map((post) =>
								post.slug.startsWith("tech") &&
								!post.slug.startsWith("tech/psa") &&
								!post.slug.startsWith("tech/inside-e2ee") ? (
									<Link
										title={post.title}
										description={post.description}
										href={post.slug}
										date={post.lastmod ?? post.date}
										author={post.author.name}
									/>
								) : (
									""
								),
							)}
						</section>
						<h3>Inside E2EE</h3>
						<section>
							<div class="links">
								{posts.map((post) =>
									post.slug.startsWith("tech/inside-e2ee") ? (
										<Link
											title={post.title}
											description={post.description}
											href={post.slug}
											date={post.lastmod ?? post.date}
											author={post.author.name}
										/>
									) : (
										""
									),
								)}
							</div>
						</section>
						<h3>Privacy, Security and Anonymity</h3>
						<section>
							<div class="links">
								{posts.map((post) =>
									post.slug.startsWith("tech/psa") ? (
										<Link
											title={post.title}
											description={post.description}
											href={post.slug}
											date={post.lastmod ?? post.date}
											author={post.author.name}
										/>
									) : (
										""
									),
								)}
							</div>
						</section>
					</>
				) : (
					""
				)}
			</div>
		</div>
	);
}

async function indexPage() {
	return (
		<>
			{`<!doctype html>`}
			<html lang="en">
				<head>
					<link rel="icon" href="/favicon.ico" />
					<title>The Blog of Random</title>
					<meta charset="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<meta
						name="description"
						content="A blog about the most random things you can think of."
					/>
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
					<link rel="stylesheet" href="/styles/index.css" />
				</head>
				<body>
					<header>
						<div></div>
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
					<main>
						<div class="title">
							<section>
								<h1>The Blog of Random</h1>
								<p>A blog about the most random things you can think of.</p>
							</section>
							<nav>
								<a href="/" data-selected="true">
									Blog
								</a>{" "}
								/{" "}
								<a href="/notes" data-selected="false">
									Notes
								</a>
							</nav>
						</div>
						<section id="posts">
							{await Topic("history")}
							{await Topic("law")}
							{await Topic("science")}
							{await Topic("tech")}
						</section>
					</main>
				</body>
			</html>
		</>
	).toString();
}

async function notesPage() {
	const notes = await getCollection("notes").then((notes) => {
		return notes.sort((a, b) => {
			const aDate = a.lastmod ?? a.date;
			const bDate = b.lastmod ?? b.date;

			if (aDate > bDate) return -1;
			if (aDate < bDate) return 1;
			return 0;
		});
	});

	return (
		<>
			{`<!doctype html>`}
			<html lang="en">
				<head>
					<link rel="icon" href="/favicon.ico" />
					<title>Notes - The Blog of Random</title>
					<meta charset="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<meta
						name="description"
						content="A blog about the most random things you can think of."
					/>
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
					<link rel="stylesheet" href="/styles/notes/index.css" />
				</head>
				<body>
					<header>
						<div></div>
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
					<main>
						<div class="title">
							<section>
								<h1>The Blog of Random</h1>
								<p>A blog about the most random things you can think of.</p>
							</section>
							<nav>
								<a href="/" data-selected="false">
									Blog
								</a>{" "}
								/{" "}
								<a href="/notes" data-selected="true">
									Notes
								</a>
							</nav>
						</div>
						<section id="posts">
							{notes.map((note) => (
								<Link
									title={note.title}
									href={`notes/${note.slug}`}
									date={note.lastmod ?? note.date}
									author={note.author.name}
								/>
							))}
						</section>
					</main>
				</body>
			</html>
		</>
	).toString();
}

Bun.write("dist/index.html", await indexPage());
Bun.write("dist/notes/index.html", await notesPage());
