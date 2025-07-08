package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) > 1 {
		switch os.Args[1] {
		case "serve":
			serve()
			return
		case "build":
			build()
			return
		}
	}

	fmt.Println(`
ARGUMENTS:
  serve    Start an HTTP server serving the dist/ directory.
  build    Build the site.
  fonts    Fetch the fonts used on the site.`)
	os.Exit(1)
}
