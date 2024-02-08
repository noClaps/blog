import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import { codeToHtml } from "shiki";

const parserFixes = new HTMLRewriter().on(
  "pre:not(.shiki), pre:not(.shiki)>code",
  {
    element(el) {
      el.removeAndKeepContent();
    },
  },
);

const webComponent = {
  name: "webComponent",
  level: "block",
  start(src: string) {
    return src.match(/<b-(.*)>/)?.index;
  },
  // @ts-ignore
  tokenizer(src: string, _) {
    const rule = /^(<b-(?:.*)>)\n([\S\s]*?)\n(<\/b-(?:.*)>)/;
    const match = rule.exec(src);
    if (match) {
      // @ts-ignore
      const token = {
        type: "webComponent",
        raw: match[0],
        open: match[1],
        // @ts-ignore I have no clue how these types work so I'm just gonna ignore them.
        text: this.lexer.blockTokens(match[2].trim()),
        close: match[3],
        tokens: [],
      };
      return token;
    }
  },
  // @ts-ignore
  renderer(token): string {
    // @ts-ignore
    return `${token.open}${this.parser.parse(token.text)}${token.close}`;
  },
};

export default async function parseMarkdown(md: string) {
  md = md.replace(/^---([\w:\s\S]*?)---/, "").trim();

  marked.use({ extensions: [webComponent] });
  marked.use(
    gfmHeadingId(),
    markedHighlight({
      async: true,
      async highlight(code, lang) {
        return await codeToHtml(code, {
          lang,
          theme: "github-dark",
        });
      },
    }),
  );

  let html = await marked.parse(md);

  html = await parserFixes.transform(new Response(html)).text();

  return html;
}
