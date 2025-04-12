package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// This code was written by Claude because I couldn't be bothered to figure out
// how to do pretty URLs using Go's HTTP server. I doubt it's perfect, but it
// works fine so I don't really care to understand, fix or clean it up unless I
// have to.
func serve() {
	// Create a custom file server handler
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Get the path from the URL
		urlPath := r.URL.Path

		// If path ends with a slash and isn't root, redirect to remove trailing slash
		if urlPath != "/" && strings.HasSuffix(urlPath, "/") {
			http.Redirect(w, r, strings.TrimSuffix(urlPath, "/"), http.StatusMovedPermanently)
			return
		}

		// Form the actual file path
		filePath := filepath.Join("dist", urlPath)

		// Check if the file exists as-is
		if _, err := os.Stat(filePath); err == nil {
			http.ServeFile(w, r, filePath)
			return
		}

		// Check if file exists with .html extension
		htmlPath := filePath + ".html"
		if _, err := os.Stat(htmlPath); err == nil {
			http.ServeFile(w, r, htmlPath)
			return
		}

		// Check for index.html in directories
		if _, err := os.Stat(filePath); err == nil && isDirectory(filePath) {
			indexPath := filepath.Join(filePath, "index.html")
			if _, err := os.Stat(indexPath); err == nil {
				http.ServeFile(w, r, indexPath)
				return
			}
		}

		// If nothing found, return 404
		http.NotFound(w, r)
	})

	log.Println("Server started at http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func isDirectory(path string) bool {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return false
	}
	return fileInfo.IsDir()
}
