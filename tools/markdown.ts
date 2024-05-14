import { type TokenizerAndRendererExtension, marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import { codeToHtml } from "shiki";

const webComponent: TokenizerAndRendererExtension = {
  name: "webComponent",
  level: "block",
  start(src) {
    return src.match(/<b-(.*)>/)?.index;
  },
  tokenizer(src, _) {
    const rule = /^(<b-(?:.*)>)\n([\S\s]*?)\n(<\/b-(?:.*)>)/;
    const match = rule.exec(src);
    if (match) {
      const token = {
        type: "webComponent",
        raw: match[0],
        open: match[1],
        text: this.lexer.blockTokens(match[2].trim()),
        close: match[3],
        tokens: [],
      };
      return token;
    }
  },
  renderer(token) {
    return `${token.open}${this.parser.parse(token.text)}${token.close}`;
  },
};

export default async function parseMarkdown(md: string) {
  const mdWithoutFrontmatter = md.replace(/^---([\w:\s\S]*?)---/, "").trim();

  marked.use(
    { extensions: [webComponent] },
    gfmHeadingId(),
    markedHighlight({
      async: true,
      async highlight(code, lang) {
        return await codeToHtml(code, {
          lang,
          theme: "github-dark",
          structure: "inline",
        });
      },
    }),
  );

  return await marked.parse(mdWithoutFrontmatter);
}
