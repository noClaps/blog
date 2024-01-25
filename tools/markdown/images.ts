export function images(md: string) {
	const matches = md.match(/!\[([\w\s]*)\]\([\S\s]*\)$/gm)
	if (!matches) return md;

	for (const match of matches) {
		const alt = match.match(/\[([\w\s]*)\]/gm)![0].replaceAll(/[\[\]]/gm, "")
		const src = match.match(/\([\S\s]*\)/gm)![0].replaceAll(/[\(\)]/gm, "")

		md = md.replace(match, `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`)
	}

	return md
}
