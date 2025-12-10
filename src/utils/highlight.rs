use highlight::Highlight;

pub fn get_hl() -> Highlight {
    let theme = include_str!("../styles/syntax.css").parse().unwrap();
    let mut hl = Highlight::new(theme);
    hl.add_language(
        &["py"],
        tree_sitter_python::LANGUAGE.into(),
        include_str!("../queries/python/highlights.scm"),
        "",
        "",
    );
    hl.add_language(
        &["sh"],
        tree_sitter_bash::LANGUAGE.into(),
        include_str!("../queries/bash/highlights.scm"),
        "",
        "",
    );
    hl.add_language(
        &["c"],
        tree_sitter_c::LANGUAGE.into(),
        include_str!("../queries/c/highlights.scm"),
        include_str!("../queries/c/injections.scm"),
        "",
    );
    hl.add_language(
        &["ts"],
        tree_sitter_typescript::LANGUAGE_TYPESCRIPT.into(),
        include_str!("../queries/typescript/highlights.scm"),
        include_str!("../queries/typescript/injections.scm"),
        "",
    );
    hl.add_language(
        &["html"],
        tree_sitter_html::LANGUAGE.into(),
        include_str!("../queries/html/highlights.scm"),
        include_str!("../queries/html/injections.scm"),
        "",
    );
    hl.add_language(
        &["json"],
        tree_sitter_json::LANGUAGE.into(),
        include_str!("../queries/json/highlights.scm"),
        "",
        "",
    );
    hl
}
