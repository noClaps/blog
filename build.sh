write_post() {
    post=$(typst compile "src/content/$1.typ" - --root . --features html --format html)
    if [[ $post == *"data-lang"* ]]; then
        echo "$post" | ./target/release/blog > "dist/$1.html"
    else
        echo "$post" > "dist/$1.html"
    fi
}

rm -rf dist/
files=($(echo src/content/**/*.typ))
mkdir -p dist
cp -r public/** dist
cargo build --release
for f in ${files[@]}; do
    f="${f%.*}"
    f="${f:12}"
    mkdir -p "dist/$(dirname $f)"
    write_post "$f" &
done

files="${files[@]}"
typst compile src/pages/index.typ dist/index.html --root . --features html --input data="$files"
typst compile src/pages/feed.typ - --format html --root . --features html --input data="$files" | ./target/release/blog feed > "dist/feed.atom"

wait
