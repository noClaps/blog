use tree_sitter_highlight::{HighlightConfiguration, Highlighter, HtmlRenderer};

pub fn highlight(code: &str, language: &str) -> String {
    let config = get_language(language).expect(&format!("Language not supported: {language}"));

    let mut highlighter = Highlighter::new();
    let highlights = highlighter
        .highlight(&config, code.as_bytes(), None, |capture| {
            Some(Box::leak(Box::new(get_language(capture)?)))
        })
        .unwrap();

    let mut html_renderer = HtmlRenderer::new();
    html_renderer
        .render(highlights, code.as_bytes(), &|h, output| {
            output.extend(
                format!("style=\"{}\"", RECOGNISED_NAMES[h.0].1)
                    .replace('.', "-")
                    .as_bytes(),
            );
        })
        .unwrap();
    let highlighted_text: String = html_renderer.lines().collect();
    highlighted_text.trim().to_string()
}

fn get_language(name: &str) -> Option<HighlightConfiguration> {
    let config = match name {
        "bash" | "sh" => HighlightConfiguration::new(
            tree_sitter_bash::LANGUAGE.into(),
            "bash",
            include_str!("./queries/bash/highlights.scm"),
            "",
            "",
        )
        .ok(),
        "c" => HighlightConfiguration::new(
            tree_sitter_c::LANGUAGE.into(),
            "c",
            include_str!("./queries/c/highlights.scm"),
            include_str!("./queries/c/injections.scm"),
            "",
        )
        .ok(),
        "html" => HighlightConfiguration::new(
            tree_sitter_html::LANGUAGE.into(),
            "html",
            include_str!("./queries/html/highlights.scm"),
            include_str!("./queries/html/injections.scm"),
            "",
        )
        .ok(),
        "json" => HighlightConfiguration::new(
            tree_sitter_json::LANGUAGE.into(),
            "json",
            include_str!("./queries/json/highlights.scm"),
            "",
            "",
        )
        .ok(),
        "python" | "py" => HighlightConfiguration::new(
            tree_sitter_python::LANGUAGE.into(),
            "python",
            include_str!("./queries/python/highlights.scm"),
            include_str!("./queries/python/injections.scm"),
            "",
        )
        .ok(),
        "typescript" | "ts" => HighlightConfiguration::new(
            tree_sitter_typescript::LANGUAGE_TYPESCRIPT.into(),
            "typescript",
            include_str!("./queries/typescript/highlights.scm"),
            include_str!("./queries/typescript/injections.scm"),
            "",
        )
        .ok(),
        _ => None,
    };

    config.map(|mut c| {
        c.configure(&RECOGNISED_NAMES.iter().map(|n| n.0).collect::<Vec<_>>());
        c
    })
}

const RECOGNISED_NAMES: &[(&str, &str)] = &[
    ("attribute", "color:#83d288;"),
    ("boolean", "color:#ff732e;"),
    ("comment", "color:#666;"),
    ("constant", "color:#99c7ff;"),
    ("constructor", "color:#ff9f5b;"),
    ("emphasis", "font-style:italic;"),
    ("emphasis.strong", "font-weight:bold;"),
    ("enum", "color:#ff9f5b;"),
    ("function", "color:#bf89ff;"),
    ("keyword", "color:#ff6b68;"),
    ("label", "color:#99c7ff;"),
    ("link_text", "color:#ff732e;"),
    ("link_uri", "color:#3984f2;"),
    ("number", "color:#ff732e;"),
    ("operator", "color:#aaa;"),
    ("preproc", "color:#ff6b68;"),
    ("property", "color:#83d288;"),
    ("punctuation", "color:#666;"),
    ("punctuation.bracket", "color:#666;"),
    ("punctuation.delimiter", "color:#666;"),
    ("punctuation.list_marker", "color:#666;"),
    ("punctuation.special", "color:#666;"),
    ("string", "color:#ff9f5b;"),
    ("string.escape", "color:#aaa;"),
    ("tag", "color:#ff6b68;"),
    ("text.literal", "color:#ff9f5b;"),
    ("title", "font-weight:bold;"),
    ("type", "color:#ff9f5b;"),
    ("variable", "color:#ccc;"),
];
