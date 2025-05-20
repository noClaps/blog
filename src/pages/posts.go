package pages

import (
	"bytes"
	"fmt"
	"text/template"
	"time"

	utils "github.com/noClaps/blog/src"
	"github.com/noClaps/znak"
)

type renderedPost struct {
	FilePath string
	Post     string
}

func Posts() ([]renderedPost, error) {
	type tmplVals struct {
		Title       string
		Description string
		PubDate     string
		PostDesc    string
		Children    string
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

		description := "A blog about the most random things you can think of."
		postDesc := ""
		if post.Description != "" {
			description = post.Description
			postDesc = fmt.Sprintf(`<p class="description">%s</p>`, post.Description)
		}

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
			Title:       post.Title,
			Description: description,
			PubDate:     post.Date.Format(time.DateOnly),
			PostDesc:    postDesc,
			Children:    content,
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
