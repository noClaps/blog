from glob import glob
from html import unescape
from os import makedirs
from os.path import dirname
from shutil import copytree, rmtree
from subprocess import PIPE, run

rmtree("dist", ignore_errors=True)
files = glob("src/content/**/*.typ")
makedirs("dist")
copytree("public", "dist", dirs_exist_ok=True)

for f in files:
    f = f.split(".", maxsplit=1)[0][12:]
    makedirs(f"dist/{dirname(f)}", exist_ok=True)
    run(
        [
            "typst",
            "compile",
            f"src/content/{f}.typ",
            f"dist/{f}.html",
            "--root",
            ".",
            "--features",
            "html",
        ]
    )

run(
    [
        "typst",
        "compile",
        "src/pages/index.typ",
        "dist/index.html",
        "--root",
        ".",
        "--features",
        "html",
        "--input",
        f"data={' '.join(files)}",
    ]
)
feed = run(
    [
        "typst",
        "compile",
        "src/pages/feed.typ",
        "-",
        "--root",
        ".",
        "--features",
        "html",
        "--format",
        "html",
        "--input",
        f"data={' '.join(files)}",
    ],
    stdout=PIPE
)


def process_feed(html: str) -> str:
    start_index = html.find("<p>") + 3
    end_index = start_index + html[start_index:].find("</p>")
    return unescape(html[start_index:end_index])


with open("dist/feed.atom", "w") as f:
    f.write(process_feed(str(feed.stdout)))
