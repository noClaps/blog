export function codeBlock(md: string) {
	const matches = md.match(/```(\w*)\n([\S\s]*?)```/gm)
	if (!matches) return md;

	for (const match of matches) {
		const languageRegex = /```\w*[^\n]$/gm
		const language = match.match(languageRegex)
		
		if (language) {
			md = md.replace(match, `<pre data-lang="${language[0].replace("```", "")}"><code>${encodeURI(match.replaceAll(/```\w*$/gm, "").trim())}</code></pre>`)
		} else {
			md = md.replace(match, `<pre><code>${encodeURI(match.replaceAll("```", "").trim())}</code></pre>`)
		}
	}

	return md
}

export function inlineCode(md: string) {
	const matches = md.match(/`[\w\s]*`/gm)
	if (!matches) return md;

	for (const match of matches) {
		md = md.replace(match, `<code>${encodeURI(match.replaceAll("`", "").trim())}</code>`)
	}

	return md
}
