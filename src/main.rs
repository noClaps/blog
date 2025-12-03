use std::{collections::HashMap, fs, path::PathBuf, process::Command};

use highlight::{Highlight, HighlightConfiguration};
use kuchikiki::traits::TendrilSink;

fn main() {
    fs::create_dir_all("dist").unwrap();
    // TODO: Uncomment when Typst supports MathML
    // fs::copy(
    //     "public/NewCMMath-Regular.woff2",
    //     "dist/NewCMMath-Regular.woff2",
    // )
    // .unwrap();

    let files = get_posts(PathBuf::from("src/content"));

    let files_list = format!(
        "({})",
        files
            .iter()
            .map(|f| format!("\"{}\"", f))
            .collect::<Vec<_>>()
            .join(",")
    );
    let index = run_typst_cmd(
        "src/pages/index.typ",
        HashMap::from([("files", &files_list)]),
    );
    fs::write("dist/index.html", index).unwrap();

    // TODO: Figure out how to do Atom feed

    let hl = get_hl();
    for f in files {
        let output_path = PathBuf::from(format!("dist/{}.html", f));
        let outdir = output_path.parent().unwrap();
        fs::create_dir_all(outdir).unwrap();

        let out = run_typst_cmd("src/pages/post.typ", HashMap::from([("post", &f)]));
        let out = process_post(&out, &hl);
        fs::write(output_path, out).unwrap();
    }
}

fn run_typst_cmd(file: &str, inputs: HashMap<&str, &String>) -> String {
    let mut cmd = Command::new("typst");
    cmd.args(["compile", file, "-"]);
    cmd.args(["--format", "html"]);
    cmd.args(["--root", "."]);
    cmd.args(["--features", "html"]); // TODO: Remove when HTML export is stable
    for (key, val) in inputs {
        cmd.args(["--input", &format!("{}={}", key, val)]);
    }
    let output = cmd.output().unwrap();
    if !output.status.success() {
        panic!("{}", String::from_utf8_lossy(&output.stderr))
    }
    String::from_utf8_lossy(&output.stdout).to_string()
}

pub fn get_posts(path: PathBuf) -> Vec<String> {
    let mut files = vec![];

    for dir_entry in fs::read_dir(path).unwrap() {
        let dir_entry = dir_entry.unwrap();
        let path = dir_entry.path();
        if path.is_dir() {
            files.append(&mut get_posts(path));
        } else if path.is_file() && path.extension().is_some_and(|ext| ext == "typ") {
            let path = path.to_string_lossy();
            let path = path
                .trim_end_matches(".typ")
                .trim_start_matches("src/content/")
                .to_string();
            files.push(path);
        }
    }

    files
}

fn get_hl() -> Highlight {
    let theme = include_str!("./styles/syntax.css").parse().unwrap();
    let mut hl = Highlight::new(theme);
    hl.add_language(
        &["py"],
        HighlightConfiguration::new(
            tree_sitter_python::LANGUAGE.into(),
            "python",
            include_str!("./queries/python/highlights.scm"),
            "",
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["sh"],
        HighlightConfiguration::new(
            tree_sitter_bash::LANGUAGE.into(),
            "bash",
            include_str!("./queries/bash/highlights.scm"),
            "",
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["c"],
        HighlightConfiguration::new(
            tree_sitter_c::LANGUAGE.into(),
            "c",
            include_str!("./queries/c/highlights.scm"),
            include_str!("./queries/c/injections.scm"),
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["ts"],
        HighlightConfiguration::new(
            tree_sitter_typescript::LANGUAGE_TYPESCRIPT.into(),
            "typescript",
            include_str!("./queries/typescript/highlights.scm"),
            include_str!("./queries/typescript/injections.scm"),
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["html"],
        HighlightConfiguration::new(
            tree_sitter_html::LANGUAGE.into(),
            "html",
            include_str!("./queries/html/highlights.scm"),
            include_str!("./queries/html/injections.scm"),
            "",
        )
        .unwrap(),
    );
    hl.add_language(
        &["json"],
        HighlightConfiguration::new(
            tree_sitter_json::LANGUAGE.into(),
            "json",
            include_str!("./queries/json/highlights.scm"),
            "",
            "",
        )
        .unwrap(),
    );
    hl
}

fn process_post(html: &str, hl: &Highlight) -> String {
    let document = kuchikiki::parse_html().one(html);
    let mut to_detach = vec![];
    for css_match in document.select("code[data-lang]").unwrap() {
        let attributes = css_match.attributes.borrow();
        let lang = attributes.get("data-lang").unwrap();
        let text_node = css_match
            .as_node()
            .children()
            .filter_map(|c| match c.as_element() {
                None => Some(c.text_contents()),
                Some(_) => Some("\n".to_string()),
            });
        let code = text_node.collect::<Vec<_>>().join("");

        let highlighted = hl.highlight(&code, lang);
        let highlighted = kuchikiki::parse_html().one(highlighted);
        let new_node = highlighted.select_first("code").unwrap().as_node().clone();

        let old_node = css_match.as_node().clone();
        old_node.insert_after(new_node);
        to_detach.push(old_node);
    }
    for node in to_detach {
        node.detach();
    }

    document.to_string()
}
