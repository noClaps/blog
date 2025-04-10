package pages

import (
	"bytes"
	"slices"
	"text/template"
	"time"

	utils "github.com/noClaps/blog/src"
)

func Index() (string, error) {
	type postTmpl struct {
		Href  string
		Date  string
		Title string
	}

	sortFunc := func(a utils.Post, b utils.Post) int {
		aDate := a.Date
		if !a.LastMod.IsZero() {
			aDate = a.LastMod
		}
		bDate := b.Date
		if !b.LastMod.IsZero() {
			bDate = b.LastMod
		}

		if aDate.After(bDate) {
			return -1
		}
		if aDate.Before(bDate) {
			return 1
		}
		return 0
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
		date := post.Date
		if !post.LastMod.IsZero() {
			date = post.LastMod
		}
		postsTmpl = append(postsTmpl, postTmpl{
			Href:  post.Slug,
			Date:  date.Format(time.DateOnly),
			Title: post.Title,
		})
	}

	notes = slices.DeleteFunc(notes, func(post utils.Post) bool {
		return post.Slug[:len("/notes/")] != "/notes/"
	})
	slices.SortFunc(notes, sortFunc)
	notesTmpl := []postTmpl{}
	for _, note := range notes {
		date := note.Date
		if !note.LastMod.IsZero() {
			date = note.LastMod
		}
		notesTmpl = append(notesTmpl, postTmpl{
			Href:  note.Slug,
			Date:  date.Format(time.DateOnly),
			Title: note.Title,
		})
	}

	stories = slices.DeleteFunc(stories, func(post utils.Post) bool {
		return post.Slug[:len("/stories/")] != "/stories/"
	})
	slices.SortFunc(stories, sortFunc)
	storiesTmpl := []postTmpl{}
	for _, story := range stories {
		date := story.Date
		if !story.LastMod.IsZero() {
			date = story.LastMod
		}
		storiesTmpl = append(storiesTmpl, postTmpl{
			Href:  story.Slug,
			Date:  date.Format(time.DateOnly),
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
