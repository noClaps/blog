import type { Heading } from "./types"

function frontmatter(md: string) {
	const frontmatterRegex = md.match(/^---([\w:\s\S]*?)---/)
	if (!frontmatterRegex) throw new Error("Frontmatter not found");

	let frontmatter = frontmatterRegex[0]
	
	frontmatter = frontmatter.replaceAll(/\n?---\n?/g, "")
	const frontmatterData = frontmatter.split("\n").map(str => str.split(/:\s?/))

	const dataObject: {[key: string]: string} = {}
	for (let data of frontmatterData) {
		data = data.map(i => i.replaceAll(`"`, ``))
		dataObject[data[0]] = data.slice(1).join(": ")
	}

	return dataObject
}

export async function getCollection(name: string) {	
	const glob = new Bun.Glob("**/**/**.{md,json}")
	const collection = glob.scanSync({cwd: `src/content/${name}`})
	
	const data = []
	for (const file of collection) {
		if (file.endsWith("json")) {
			data.push(await Bun.file(`./src/content/${name}/${file}`).json())
		} else {
			data.push(
				{
					slug: file.replace(".md", ""),
					...frontmatter(await Bun.file(`./src/content/${name}/${file}`).text())
				})
		}
	}

	for (const item of data) {
		if (item.date) item.date = new Date(item.date);
		if (item.lastmod) item.lastmod = new Date(item.lastmod);
		if (item.series) item.series = parseInt(item.series);
		if (item.author) {
			item.author = (await getCollection("authors")).find(i => i.name === item.author)
		}
	}

	return data
}

export function headings(html: string) {
	const headings: Heading[] = []

	const matches = html.match(/<h(\d)\sid="(.*)">(.*)<\/h\d>/g)
	if (!matches) return headings;

	for (const match of matches) {
		const escapedMatch = match.replace(/<h\d\sid="(?:.*)">(.*)<\/h\d>/g, (match, string) => {
			return match.replace(string, string.replaceAll(`"`, `\\"`))
		})
		const heading = escapedMatch.replace(/<h(\d)\sid="(.*)">(.*)<\/h\d>/g, `{"depth": $1, "slug": "$2", "title": "$3"}`)
		headings.push(JSON.parse(heading))
	}

	return headings
}
