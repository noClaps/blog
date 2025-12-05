use std::{collections::HashMap, fs, path::PathBuf};

use crate::utils::{
    highlight::get_hl,
    posts::{get_posts, process_post},
    typst::run_typst_cmd,
};

mod utils {
    pub mod highlight;
    pub mod posts;
    pub mod typst;
}

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
