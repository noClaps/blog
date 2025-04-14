package pages

import (
	"encoding/xml"
	"fmt"
	"html"
	"time"

	utils "github.com/noClaps/blog/src"
	"github.com/noClaps/znak"
)

func atomFeed(items []utils.Post, content map[string]string, lastUpdate time.Time) (string, error) {
	type Link struct {
		Rel  string `xml:"rel,attr"`
		Href string `xml:"href,attr"`
	}
	type EntryContent struct {
		Type    string `xml:"type,attr"`
		Content string `xml:",innerxml"`
	}
	type Entry struct {
		XMLName   xml.Name     `xml:"entry"`
		Id        string       `xml:"id"`
		Title     string       `xml:"title"`
		Updated   string       `xml:"updated"`
		Content   EntryContent `xml:"content"`
		Link      Link         `xml:"link"`
		Summary   string       `xml:"summary,omitempty"`
		Published string       `xml:"published"`
	}
	type Feed struct {
		XMLName    xml.Name `xml:"feed"`
		XMLNs      string   `xml:"xmlns,attr"`
		Id         string   `xml:"id"`
		Title      string   `xml:"title"`
		LastUpdate string   `xml:"updated"`
		Link       Link     `xml:"link"`
		Icon       string   `xml:"icon"`
		Subtitle   string   `xml:"subtitle"`
		Author     string   `xml:"author>name"`
		Entries    []Entry  `xml:"feed"`
	}

	atomEntries := []Entry{}
	for _, item := range items {
		updated := item.Date
		if !item.LastMod.IsZero() {
			updated = item.LastMod
		}
		atomEntries = append(atomEntries, Entry{
			Id:      fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			Title:   item.Title,
			Updated: updated.Format(time.RFC3339),
			Content: EntryContent{
				Type:    "html",
				Content: html.EscapeString(content[item.Slug]),
			},
			Link: Link{
				Rel:  "self",
				Href: fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			},
			Summary:   item.Description,
			Published: item.Date.Format(time.RFC3339),
		})
	}

	feed := Feed{
		XMLNs:      "http://www.w3.org/2005/Atom",
		Id:         "https://blog.zerolimits.dev/",
		Title:      "The Blog of Random",
		LastUpdate: lastUpdate.Format(time.RFC3339),
		Link: Link{
			Rel:  "self",
			Href: "https://blog.zerolimits.dev/feed.atom",
		},
		Icon:     "https://blog.zerolimits.dev/favicon.ico",
		Subtitle: "A blog about the most random things you can think of.",
		Author:   "noClaps",
		Entries:  atomEntries,
	}
	xml, err := xml.Marshal(feed)
	if err != nil {
		return "", err
	}
	return string(xml), nil
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
