export function headings(md: string, level: number) {
	const regex = new RegExp(`^#{${level}}\\s([\\w\\s]*?)$`, "gm")
	const matches = md.match(regex)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<h${level}>${match.replace(`${"#".repeat(level)} `, "")}</h${level}>`)
	}

	return md
}

