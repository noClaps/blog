export function bold(md: string) {
	const matches = md.match(/(?:\*\*|\_\_)([\w\s?]*)(?:\*\*|\_\_)/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<strong>${match.replaceAll(/(?:\*\*|\_\_)/g, "")}</strong>`)
	}

	return md
}

export function italic(md: string) {
	const matches = md.match(/\*([\w\s?]*)\*|\_([\w\s?]*)\_/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<em>${match.replaceAll(/\*|\_/g, "")}</em>`)
	}

	return md
}

export function strikethrough(md: string) {
	const matches = md.match(/~~([\w\s]*)~~/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<s>${match.replaceAll("~~", "")}</s>`)
	}

	return md
}

export function subscript(md: string) {
	const matches = md.match(/~([\w\s]*)~/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<sub>${match.replaceAll("~", "")}</sub>`)
	}

	return md
}

export function superscript(md: string) {
	const matches = md.match(/\^([\w\s]*)\^/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<sup>${match.replaceAll("^", "")}</sup>`)
	}

	return md
}

export function mark(md: string) {
	const matches = md.match(/==([\w\s]*)==/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<mark>${match.replaceAll("==", "")}</mark>`)
	}

	return md
}
