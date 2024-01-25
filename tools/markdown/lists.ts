export function checklist(md: string) {
	const matches = md.match(/-\s\[[\sx]\]\s(.*)/gm)
	if (!matches) return md;

	for (const match of matches) {
		const unchecked = match.replaceAll(/-\s\[\s\]\s(.*)/gm, `<input type="checkbox" disabled>$1</input>`)
		const checked = unchecked.replaceAll(/-\s\[x\]\s(.*)/gm, `<input type="checkbox" checked disabled>$1</input>`)

		md = md.replace(match, checked)
	}

	return md
}

export function ul(md: string) {
	const matches = md.match(/^-\s(.*)(\n\s{2,}(-|\d\.)\s(.*)|\n-(.*))*/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<ul>\n${match}\n</ul>`)
	}

	return md
}

export function ol(md: string) {
	const matches = md.match(/^\d\.\s(.*)(\n\s{2,}(-|\d\.)\s(.*)|\n\d\.\s(.*))*/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<ol>\n${match}\n</ol>`)
	}

	return md
}

export function li(md: string, attempt: number) {
	const matches = md.match(/^(-|\d\.)\s(.*)(\n\s{2,}(-|\d\.)\s(.*))*/gm)
	if (!matches) return md;

	for (const match of matches) {
		if (attempt === 1) {
			md = md.replace(match, `<li>\n${match.replace(/^(-|\d\.)\s/, "")}\n</li>`)	
		}
	}

	const nestedRegex = new RegExp(`^\\s{2,}(-|\\d\\.)\\s(.*)(\\n\\s{2,}(-|\\d\\.)\\s(.*))*`, "gm")
	const nestedMatches = md.match(nestedRegex)
	if (!nestedMatches) return md;

	for (const match of nestedMatches) {
		const nestedMatch = match.split(/\n\s{2}(-|\d\.)/).map(i => i.trim())

		for (const match2 of nestedMatch) {
			if (match2.startsWith("-")) {
				const html = `<ul>\n<li>\n${nestedMatch.map(m => m.replace("- ", "")).join("\n</li>\n<li>\n")}\n</li>\n</ul>`
				md = md.replace(match, html)
			} else {
				const html = `<ol>\n<li>\n${nestedMatch.map(m => m.replace(/\d\.\s/, "")).join("\n</li>\n<li>\n")}\n</li>\n</ol>`
				md = md.replace(match, html)
			}
		}
	}

	if (attempt === 2) {
		md = md.replaceAll(/^<li>\n(-|\d\.)\n<\/li>/gm, "")
	}

	return md
}
