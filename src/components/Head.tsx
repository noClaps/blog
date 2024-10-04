export default function Head() {
	return (
		<>
			<link rel="icon" href="/favicon.ico" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
		</>
	);
}
