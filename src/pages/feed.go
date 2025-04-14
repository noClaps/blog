package pages

import (
	"bytes"
	"fmt"
	"html"
	"text/template"
	"time"

	utils "github.com/noClaps/blog/src"
	"github.com/noClaps/znak"
)

func atomFeed(items []utils.Post, content map[string]string, lastUpdate time.Time) (string, error) {
	type Entry struct {
		Id        string
		Title     string
		Updated   string
		Content   string
		Link      string
		Summary   string
		Published string
	}
	type Feed struct {
		LastUpdate string
		Entries    []Entry
	}

	atomEntries := []Entry{}
	for _, item := range items {
		updated := item.Date
		if !item.LastMod.IsZero() {
			updated = item.LastMod
		}
		atomEntries = append(atomEntries, Entry{
			Id:        fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			Title:     item.Title,
			Updated:   updated.Format(time.RFC3339),
			Content:   html.EscapeString(content[item.Slug]),
			Link:      fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			Summary:   item.Description,
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

	lastUpdate := time.Time{}
	content := map[string]string{}

	for _, item := range items {
		itemDate := item.Date
		if !item.LastMod.IsZero() {
			itemDate = item.LastMod
		}
		if itemDate.Compare(lastUpdate) == 1 {
			lastUpdate = itemDate
		}

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

	atom, err := atomFeed(items, content, lastUpdate)
	if err != nil {
		return "", err
	}

	return atom, nil
}
