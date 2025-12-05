use std::{collections::HashMap, process::Command};

pub fn run_typst_cmd(file: &str, inputs: HashMap<&str, &String>) -> String {
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
