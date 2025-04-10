package main

import (
	"fmt"
	"log"
	"os"
	"path"
	"strings"

	"github.com/noClaps/blog/src/pages"
	"golang.org/x/net/html"
)

func main() {
	index, err := pages.Index()
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
		parentDir := path.Dir(fmt.Sprintf("dist%s", post.FilePath))
		os.MkdirAll(parentDir, 0777)
		if err = os.WriteFile(fmt.Sprintf("dist%s", post.FilePath), []byte(post.Post), 0666); err != nil {
			log.Println("[ERROR]", err)
		}
		if err = buildPost(post.Post, post.FilePath); err != nil {
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
	return nil
}

func buildPost(post string, filePath string) error {
	doc, err := html.Parse(strings.NewReader(post))
	if err != nil {
		return err
	}

	dirPath := strings.ReplaceAll(filePath, ".html", "")

	var processNode func(n *html.Node) error
	processNode = func(n *html.Node) error {
		if n.Type == html.ElementNode {
			if n.Data == "a" {
				hasDownload := false
				href := ""
				for _, attr := range n.Attr {
					if attr.Key == "download" {
						hasDownload = true
					}
					if attr.Key == "href" {
						href = attr.Val
					}
				}

				if hasDownload && href != "" {
					fileName := path.Base(href)
					filePath := path.Join(dirPath, fileName)

					if err = os.MkdirAll(path.Dir(path.Join("dist", filePath)), 0777); err != nil {
						return err
					}
					content, err := os.ReadFile(path.Join("src/content", filePath))
					if err != nil {
						return err
					}
					if err = os.WriteFile(path.Join("dist", filePath), content, 0666); err != nil {
						return err
					}
				}
			}

			if n.Data == "img" {
				src := ""
				for _, attr := range n.Attr {
					if attr.Key == "src" {
						src = attr.Val
						break
					}
				}

				if src != "" && src[0:2] == "./" {
					fileName := path.Base(src)
					filePath := path.Join(dirPath, fileName)

					if err = os.MkdirAll(path.Dir(path.Join("dist", filePath)), 0777); err != nil {
						return err
					}
					content, err := os.ReadFile(path.Join("src/content", filePath))
					if err != nil {
						return err
					}
					if err = os.WriteFile(path.Join("dist", filePath), content, 0666); err != nil {
						return err
					}
				}
			}
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			if err = processNode(c); err != nil {
				return err
			}
		}

		return nil
	}

	if err = processNode(doc); err != nil {
		return err
	}

	return nil
}
