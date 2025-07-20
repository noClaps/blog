package pages

import (
	"bytes"
	"slices"
	"text/template"
	"time"

	utils "github.com/noclaps/blog/src"
)

func Index() (string, error) {
	type postTmpl struct {
		Href  string
		Date  string
		Title string
	}

	sortFunc := func(a utils.Post, b utils.Post) int {
		switch {
		case a.Date.After(b.Date):
			return -1
		case a.Date.Before(b.Date):
			return 1
		default:
			return 0
		}
	}

	items, err := utils.GetPosts()
	posts := slices.Clone(items)
	notes := slices.Clone(items)
	stories := slices.Clone(items)
	if err != nil {
		return "", err
	}
	posts = slices.DeleteFunc(posts, func(post utils.Post) bool {
		return post.Slug[:len("/posts/")] != "/posts/"
	})
	slices.SortFunc(posts, sortFunc)
	postsTmpl := []postTmpl{}
	for _, post := range posts {
		postsTmpl = append(postsTmpl, postTmpl{
			Href:  post.Slug,
			Date:  post.Date.Format(time.DateOnly),
			Title: post.Title,
		})
	}

	notes = slices.DeleteFunc(notes, func(post utils.Post) bool {
		return post.Slug[:len("/notes/")] != "/notes/"
	})
	slices.SortFunc(notes, sortFunc)
	notesTmpl := []postTmpl{}
	for _, note := range notes {
		notesTmpl = append(notesTmpl, postTmpl{
			Href:  note.Slug,
			Date:  note.Date.Format(time.DateOnly),
			Title: note.Title,
		})
	}

	stories = slices.DeleteFunc(stories, func(post utils.Post) bool {
		return post.Slug[:len("/stories/")] != "/stories/"
	})
	slices.SortFunc(stories, sortFunc)
	storiesTmpl := []postTmpl{}
	for _, story := range stories {
		storiesTmpl = append(storiesTmpl, postTmpl{
			Href:  story.Slug,
			Date:  story.Date.Format(time.DateOnly),
			Title: story.Title,
		})
	}

	tmpl, err := template.ParseFiles("src/pages/index.html")
	output := bytes.Buffer{}
	if err = tmpl.Execute(&output, struct {
		Posts, Notes, Stories []postTmpl
	}{postsTmpl, notesTmpl, storiesTmpl}); err != nil {
		return "", err
	}

	return output.String(), nil
}
