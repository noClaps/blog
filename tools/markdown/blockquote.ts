export function blockquote(md: string) {
	const matches = md.match(/^( {0,3}> ?([^\n]*)(?:\n|$))+/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<blockquote>\n${match.replaceAll("> ", "")}</blockquote>`)
	}

	return md
}
