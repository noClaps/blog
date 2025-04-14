package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"os"
	"path"
	"slices"
	"strings"

	"github.com/noClaps/blog/src/pages"
	"golang.org/x/net/html"
)

func build() {
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
	feed, err := pages.Feed()
	if err != nil {
		return err
	}
	if err = os.WriteFile("dist/feed.atom", []byte(feed), 0666); err != nil {
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

func buildPost(post string, filePath string) (string, error) {
	doc, err := html.Parse(strings.NewReader(post))
	if err != nil {
		return "", err
	}

	dirPath := strings.ReplaceAll(filePath, ".html", "")

	var processNode func(n *html.Node) error
	processNode = func(n *html.Node) error {
		nodesToRemove := []html.Node{}

		if n.Type == html.ElementNode {
			if n.Data == "img" {
				src := ""
				attrIndex := 0
				for i, attr := range n.Attr {
					if attr.Key == "src" {
						attrIndex = i
						src = attr.Val
						break
					}
				}

				if src != "" && src[0:2] == "./" {
					n.Attr = slices.Delete(n.Attr, attrIndex, attrIndex+1)
					fileName := path.Base(src)
					filePath := path.Join(dirPath, fileName)

					content, err := os.ReadFile(path.Join("src/content", filePath))
					if err != nil {
						return err
					}
					data, format, err := image.DecodeConfig(bytes.NewReader(content))
					if err != nil {
						return err
					}
					output := base64.StdEncoding.EncodeToString(content)
					n.Attr = append(n.Attr,
						html.Attribute{Key: "src", Val: fmt.Sprintf("data:image/%s;base64,%s", format, output)},
						html.Attribute{Key: "width", Val: fmt.Sprint(data.Width)},
						html.Attribute{Key: "height", Val: fmt.Sprint(data.Height)},
					)
				}
			}

			// TODO: remove this when Treeblood supports MathML Core
			if n.Parent.Parent != nil && slices.ContainsFunc(n.Parent.Parent.Attr, func(attr html.Attribute) bool {
				return attr.Key == "columnalign"
			}) {
				style := ""
				for _, attr := range n.Parent.Parent.Attr {
					if attr.Key == "columnalign" {
						style = fmt.Sprintf("text-align:%s", attr.Val)
					}
				}

				if slices.ContainsFunc(n.Attr, func(attr html.Attribute) bool {
					return attr.Key == "columnalign"
				}) {
					for i, attr := range n.Attr {
						if attr.Key == "columnalign" {
							style = fmt.Sprintf("text-align:%s", attr.Val)
							n.Attr = slices.Delete(n.Attr, i, i+1)
							break
						}
					}
				}
				n.Attr = append(n.Attr, html.Attribute{
					Key: "style",
					Val: style,
				})
				n.Parent.Parent.Attr = slices.DeleteFunc(n.Parent.Parent.Attr, func(attr html.Attribute) bool {
					return attr.Key == "rowalign"
				})
			}
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			if err = processNode(c); err != nil {
				return err
			}
		}

		for _, n := range nodesToRemove {
			n.Parent.RemoveChild(&n)
		}

		return nil
	}

	if err = processNode(doc); err != nil {
		return "", err
	}

	out := bytes.Buffer{}
	html.Render(&out, doc)

	return out.String(), nil
}

func buildHtml(input string) (string, error) {
	doc, err := html.Parse(strings.NewReader(input))
	if err != nil {
		return "", err
	}

	var processNode func(n *html.Node) error
	processNode = func(n *html.Node) error {
		nodesToRemove := []html.Node{}

		if n.Type == html.ElementNode {
			if n.Data == "a" {
				href := ""
				hasTarget := false
				hasRel := false
				for _, attr := range n.Attr {
					if attr.Key == "target" {
						hasTarget = true
					}
					if attr.Key == "rel" {
						hasRel = true
					}
					if attr.Key == "href" {
						href = attr.Val
					}
				}

				if !hasTarget && !hasRel && href != "" && len(href) > len("https://") && href[:len("https://")] == "https://" {
					n.Attr = append(n.Attr,
						html.Attribute{Key: "target", Val: "_blank"},
						html.Attribute{Key: "rel", Val: "noopener noreferrer"},
					)
				}
			}

			if n.Data == "link" {
				hasRel := false
				href := ""
				for _, attr := range n.Attr {
					if attr.Key == "rel" && attr.Val == "stylesheet" {
						hasRel = true
					}
					if attr.Key == "href" {
						href = attr.Val
					}
				}

				if hasRel && href != "" {
					content, err := os.ReadFile(path.Join("src", href))
					if err != nil {
						return err
					}

					styleNode, err := html.ParseFragment(strings.NewReader(fmt.Sprintf("<style>%s</style>", string(content))), n.Parent)
					if err != nil {
						return err
					}
					n.Parent.AppendChild(styleNode[0])
					nodesToRemove = append(nodesToRemove, *n)
				}
			}
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			if err = processNode(c); err != nil {
				return err
			}
		}

		for _, n := range nodesToRemove {
			n.Parent.RemoveChild(&n)
		}

		return nil
	}

	if err = processNode(doc); err != nil {
		return "", err
	}

	out := bytes.Buffer{}
	html.Render(&out, doc)

	return out.String(), nil
}
