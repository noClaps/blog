build() {
    files=($(echo src/content/**/*.typ))
    mkdir -p dist
    # cp -r public/** dist # TODO: Uncomment when Typst supports MathML
    cargo build --release
    for f in ${files[@]}; do
        f="${f%.*}"
        f="${f:12}"
        mkdir -p "dist/$(dirname $f)"
        typst compile "src/content/$f.typ" - --root . --features html --format html | ./target/release/blog > "dist/$f.html" &
    done

    files="${files[@]}"
    typst compile src/pages/index.typ dist/index.html --format html --root . --features html --input data="$files"

    wait
}

serve() {
    watchexec --clear --restart --ignore dist './build.sh build && serve dist'
}

case $1 in
    build)
        build
        ;;
    serve)
        serve
        ;;
    *)
        build
        ;;
esac
