export function hyperlink(md: string) {
	const matches = md.match(/\[[\w\s\<\>\/]*\]\([\S\s]*?\)/gm)
	if (!matches) return md;

	for (const match of matches) {
		const text = match.match(/\[[\w\s\<\>\/]*\]/gm)![0].replaceAll(/[\[\]]/gm, "")
		const href = match.match(/\([\S\s]*?\)/gm)![0].replaceAll(/[\(\)]/gm, "")

		md = md.replace(match, `<a href="${href}">${text}</a>`)
	}

	return md
}
