export function frontmatter(regex: RegExp, md: string) {
	const frontmatterRegex = md.match(regex)
	if (!frontmatterRegex) throw new Error("Frontmatter not found");

	let frontmatter = frontmatterRegex[0]
	
	frontmatter = frontmatter.replaceAll(/\n?---\n?/g, "")
	const frontmatterData = frontmatter.split("\n").map(str => str.split(/:\s?/))

	const dataObject: {[key: string]: string} = {}
	for (const data of frontmatterData) {
		dataObject[data[0]] = data[1]
	}

	return dataObject
}
