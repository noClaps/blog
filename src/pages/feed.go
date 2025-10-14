package pages

import (
	"bytes"
	"fmt"
	"html"
	"text/template"
	"time"

	utils "github.com/noclaps/blog/src"
	"github.com/noclaps/znak"
)

func atomFeed(items []utils.Post, content map[string]string) (string, error) {
	type Entry struct {
		Id        string
		Title     string
		Updated   string
		Content   string
		Link      string
		Published string
	}
	type Feed struct {
		LastUpdate string
		Entries    []Entry
	}

	lastUpdate := time.Time{}
	atomEntries := []Entry{}
	for _, item := range items {
		updated := item.Date
		if !item.LastMod.IsZero() {
			updated = item.LastMod
		}
		if updated.Compare(lastUpdate) == 1 {
			lastUpdate = updated
		}

		atomEntries = append(atomEntries, Entry{
			Id:        fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			Title:     item.Title,
			Updated:   updated.Format(time.RFC3339),
			Content:   html.EscapeString(content[item.Slug]),
			Link:      fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			Published: item.Date.Format(time.RFC3339),
		})
	}

	feed := Feed{
		LastUpdate: lastUpdate.Format(time.RFC3339),
		Entries:    atomEntries,
	}
	tmpl, err := template.New("feed.atom").ParseFiles("src/pages/feed.atom")
	if err != nil {
		return "", err
	}

	out := bytes.Buffer{}
	err = tmpl.Execute(&out, feed)
	if err != nil {
		return "", err
	}

	return out.String(), nil
}

func Feed() (string, error) {
	items, err := utils.GetPosts()
	if err != nil {
		return "", err
	}

	content := map[string]string{}
	for _, item := range items {
		theme, err := utils.GetTheme()
		if err != nil {
			return "", err
		}
		html, err := znak.Render(item.Content, theme)
		if err != nil {
			return "", err
		}
		content[item.Slug] = html
	}

	atom, err := atomFeed(items, content)
	if err != nil {
		return "", err
	}

	return atom, nil
}
