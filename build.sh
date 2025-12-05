build() {
    files=$(echo src/content/**/*.typ)
    mkdir -p dist
    # cp -r public/** dist # TODO: Uncomment when Typst supports MathML
    typst compile src/pages/index.typ dist/index.html --format html --root . --features html --input files="$files"
    cargo run --release
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
