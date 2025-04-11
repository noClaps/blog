package main

import (
	"log"
	"os"
	"path"

	"github.com/noClaps/blog/src/pages"
)

func main() {
	index, err := pages.Index()
	if err != nil {
		log.Println("[ERROR]", err)
	}
	index, err = buildHtml(index)
	if err != nil {
		log.Println("[ERROR]", err)
	}
	if err = os.WriteFile("dist/index.html", []byte(index), 0666); err != nil {
		log.Println("[ERROR]", err)
	}
	if err = feeds(); err != nil {
		log.Println("[ERROR]", err)
	}

	posts, err := pages.Posts()
	if err != nil {
		log.Println("[ERROR]", err)
	}
	for _, post := range posts {
		post.Post, err = buildPost(post.Post, post.FilePath)
		if err != nil {
			log.Println("[ERROR]", err)
		}
		post.Post, err = buildHtml(post.Post)
		if err != nil {
			log.Println("[ERROR]", err)
		}
		parentDir := path.Dir(path.Join("dist", post.FilePath))
		os.MkdirAll(parentDir, 0777)
		if err = os.WriteFile(path.Join("dist", post.FilePath), []byte(post.Post), 0666); err != nil {
			log.Println("[ERROR]", err)
		}
	}
}

func feeds() error {
	feeds, err := pages.Feed()
	if err != nil {
		return err
	}
	if err = os.WriteFile("dist/feed.json", []byte(feeds.Json), 0666); err != nil {
		return err
	}
	if err = os.WriteFile("dist/feed.atom", []byte(feeds.Atom), 0666); err != nil {
		return err
	}
	if err = os.WriteFile("dist/feed.rss", []byte(feeds.Rss), 0666); err != nil {
		return err
	}

	feedHtml, err := os.ReadFile("src/pages/feed.html")
	if err != nil {
		return err
	}
	feedPage, err := buildHtml(string(feedHtml))
	if err != nil {
		return err
	}
	if err = os.WriteFile("dist/feed.html", []byte(feedPage), 0666); err != nil {
		return err
	}

	return nil
}
