package pages

import (
	"bytes"
	"fmt"
	"text/template"
	"time"

	"tangled.org/zerolimits.dev/znak"
	utils "tangled.sh/zerolimits.dev/blog/src"
)

type renderedPost struct {
	FilePath string
	Post     string
}

func Posts() ([]renderedPost, error) {
	type tmplVals struct {
		Title    string
		PubDate  string
		Children string
	}

	posts, err := utils.GetPosts()
	if err != nil {
		return nil, err
	}
	tmpl, err := template.ParseFiles("src/pages/posts.html")
	if err != nil {
		return nil, err
	}

	renderedPosts := []renderedPost{}
	for _, post := range posts {
		filePath := fmt.Sprintf("%s.html", post.Slug)

		theme, err := utils.GetTheme()
		if err != nil {
			return nil, err
		}
		content, err := znak.Render(post.Content, theme)
		if err != nil {
			return nil, err
		}

		postPage := bytes.Buffer{}
		vals := tmplVals{
			Title:    post.Title,
			PubDate:  post.Date.Format(time.DateOnly),
			Children: content,
		}

		if err = tmpl.Execute(&postPage, vals); err != nil {
			return nil, err
		}
		renderedPosts = append(renderedPosts, renderedPost{
			FilePath: filePath,
			Post:     postPage.String(),
		})
	}

	return renderedPosts, nil
}
