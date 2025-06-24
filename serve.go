package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
)

// This code was written by Claude because I couldn't be bothered to figure out
// how to do pretty URLs and hot reloading using Go's HTTP server. I doubt it's
// perfect, but it works fine so I don't really care to understand, fix or
// clean it up unless I have to.
func serve() {
	var server *http.Server
	var serverRunning bool

	startServerWithReload := func() {
		if serverRunning {
			return
		}

		server = startServer() // Use your modified startServer function
		serverRunning = true
		fmt.Println("Starting server on http://localhost:3000")
	}

	stopServer := func() {
		if !serverRunning || server == nil {
			return
		}

		fmt.Println("Stopping server...")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			log.Printf("Server shutdown error: %v", err)
		}
		serverRunning = false
	}

	restartServer := func() {
		stopServer()
		time.Sleep(100 * time.Millisecond) // Brief pause before restart
		startServerWithReload()
	}

	// Build site and start the server initially
	build()
	startServerWithReload()

	// Watch for file changes and restart server
	callback := func(path string, op fsnotify.Op) {
		if strings.HasPrefix(path, "dist") || strings.HasPrefix(path, "./dist") {
			return
		}

		// Only restart on write/create events, ignore chmod/rename
		if op&fsnotify.Write == fsnotify.Write || op&fsnotify.Create == fsnotify.Create {
			fmt.Printf("File changed: %s - restarting server...\n", path)
			build()
			restartServer()
		}
	}

	// Watch the dist directory (since that's what your server serves)
	err := WatchDirectoryRecursively(".", callback)
	if err != nil {
		log.Fatal(err)
	}
}

func startServer() *http.Server {
	// Reset handlers to avoid conflicts on restart
	http.DefaultServeMux = http.NewServeMux()

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
		if isDirectory(filePath) {
			indexPath := filepath.Join(filePath, "index.html")
			if _, err := os.Stat(indexPath); err == nil {
				http.ServeFile(w, r, indexPath)
				return
			}
		}

		// If nothing found, return 404
		http.NotFound(w, r)
	})

	server := &http.Server{
		Addr:    ":3000",
		Handler: nil, // Use DefaultServeMux
	}

	// Start server in a goroutine so it doesn't block
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("Server error: %v", err)
		}
	}()

	return server
}

func isDirectory(path string) bool {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return false
	}
	return fileInfo.IsDir()
}

// WatchDirectoryRecursively watches a directory and all subdirectories for changes
func WatchDirectoryRecursively(dirPath string, callback func(string, fsnotify.Op)) error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}
	defer watcher.Close()

	// Add all existing directories to watcher
	err = filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return watcher.Add(path)
		}
		return nil
	})
	if err != nil {
		return err
	}

	// Watch for events
	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return nil
			}

			// If a new directory is created, start watching it
			if event.Op&fsnotify.Create == fsnotify.Create {
				if info, err := os.Stat(event.Name); err == nil && info.IsDir() {
					watcher.Add(event.Name)
				}
			}

			// Call the callback function
			callback(event.Name, event.Op)

		case err, ok := <-watcher.Errors:
			if !ok {
				return nil
			}
			log.Printf("Watcher error: %v", err)
		}
	}
}
