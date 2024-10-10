import { getCollection } from "../../scripts/utils";
import Head from "../components/Head";
import Link from "../components/Link";
import Topic from "../components/Topic";
import Title from "../components/Title";
import Header from "../components/Header";

export async function indexPage() {
	return (
		<>
			{`<!doctype html>`}
			<html lang="en">
				<head>
					<Head />
					<title>The Blog of Random</title>
					<link rel="stylesheet" href="/styles/index.css" />
				</head>
				<body>
					<Header />
					<main>
						<Title page="index" />
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

export async function notesPage() {
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
					<Head />
					<title>Notes - The Blog of Random</title>
					<link rel="stylesheet" href="/styles/notes/index.css" />
				</head>
				<body>
					<Header />
					<main>
						<Title page="notes" />
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

export async function storiesPage() {
	const stories = await getCollection("stories");
	return (
		<>
			{`<!doctype html>`}
			<html lang="en">
				<head>
					<Head />
					<title>Stories - The Blog of Random</title>
					<link rel="stylesheet" href="/styles/stories/index.css" />
				</head>
				<body>
					<Header />
					<main>
						<Title page="stories" />
						<section id="posts">
							{stories.map((story) => (
								<Link
									title={story.title}
									href={`stories/${story.slug}`}
									author={story.author.name}
								/>
							))}
						</section>
					</main>
				</body>
			</html>
		</>
	).toString();
}
