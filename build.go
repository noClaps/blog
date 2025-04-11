package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"os"
	"path"
	"slices"
	"strings"

	"golang.org/x/net/html"
)

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
					_, format, err := image.DecodeConfig(bytes.NewReader(content))
					if err != nil {
						return err
					}
					output := base64.StdEncoding.EncodeToString(content)
					n.Attr = append(n.Attr, html.Attribute{
						Key: "src",
						Val: fmt.Sprintf("data:image/%s;base64,%s", format, output),
					})
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
