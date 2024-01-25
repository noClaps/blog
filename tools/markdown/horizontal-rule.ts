export function hr(md: string) {
	md = md.replaceAll(/^---$/gm, "<hr>")

	return md
}
