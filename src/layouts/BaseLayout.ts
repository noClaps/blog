import Header from "../components/layout/Header";

interface Props {
	title: string;
	description?: string
}

export default function BaseLayout(
	props: Props,
	slots: {
		default: string;
		head?: string;
		header?: string;
	},
	vals: {
		pathname: string;
	}
) {
	const {
		title,
		description = "A blog about the most random things you can think of."
	} = props

	return `
<!doctype html>
<html lang="en">

<head>
	<link rel="icon" href="/favicon.ico">
	<title>${title}</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content=${description}>
	<link href="https://api.fontshare.com/v2/css?f[]=switzer@2,1&display=swap" rel="stylesheet">
	<link rel="alternate" href="/feed.json" type="application/json" title="Feed">
	<link rel="stylesheet" href="/styles/global.css">
	${slots.head || ""}
</head>

<body>
	${Header({default: slots.header}, {pathname: vals.pathname})}
	${slots.default}
</body>

</html>
`
}
