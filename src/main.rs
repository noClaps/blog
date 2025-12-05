use std::{collections::HashMap, fs, path::PathBuf};

use rayon::iter::{IntoParallelIterator, ParallelIterator};

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
    let files = get_posts(PathBuf::from("src/content"));

    // TODO: Figure out how to do Atom feed

    let hl = get_hl();
    files.into_par_iter().for_each(|f| {
        let output_path = PathBuf::from(format!("dist/{}.html", f));
        let outdir = output_path.parent().unwrap();
        fs::create_dir_all(outdir).unwrap();

        let out = run_typst_cmd("src/pages/post.typ", HashMap::from([("post", &f)]));
        let out = process_post(&out, &hl);
        fs::write(output_path, out).unwrap();
    });
}
