export function table(md: string) {
	const matches = md.match(/^(\|\s?(\S(\s)*)*\|$)/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<table>\n${match}\n</table>`)
	}

	return md
}

export function tableHeading(md: string) {
	const matches = md.match(/^(\|\s?[<>\/\s\w]*)*$\n^(\|\s?[:-]-*[:-]\s?)*\|$/gm)
	if (!matches) return md;

	for (const match of matches) {
		const headings = match.replace(/^(\|\s?[:-]-*[:-]\s?)*\|$/gm, "")
		const splitHeadings = headings.split("|").map(str => str.trim())

		const html = splitHeadings.filter(m => m !== "").join("</th><th>")
		md = md.replace(match, `<thead><tr><th>${html}</th></tr></thead>`)
	}

	return md
}

export function tableBody(md: string) {
	const matches = md.match(/^(\|\s?[<\w\s>/]*)*\|$/gm)
	if (!matches) return md;

	for (const match of matches) {
		const rows = match.split("\n")
		
		const rowsHTML = rows.map(row => {
			const data = row.split("|").map(str => str.trim())
			const html = data.filter(d => d !== "").join("</td><td>")

			return html
		})

		const html = `<tr><td>${rowsHTML.join("</td></tr><tr><td>")}</td></tr>`

		md = md.replace(match, `<tbody>${html}</tbody>`)
	}

	return md
}
