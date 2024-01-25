export function paragraph(md: string) {
	const matches = md.match(/^(\w([^\n]*)(?:\n|$))+/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md && md.replace(match, `<p>${match.trim()}</p>`)
	}

	return md
}
