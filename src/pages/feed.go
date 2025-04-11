package pages

import (
	"bytes"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"html"
	"time"

	utils "github.com/noClaps/blog/src"
	"github.com/noClaps/znak"
)

type feeds struct {
	Json string
	Rss  string
	Atom string
}

func jsonFeed(items []utils.Post, content map[string]string) (string, error) {
	type jsonEntry struct {
		Id            string   `json:"id"`
		Url           string   `json:"url"`
		Title         string   `json:"title"`
		ContentHtml   string   `json:"content_html"`
		Summary       string   `json:"summary"`
		DatePublished string   `json:"date_published"`
		DateModified  string   `json:"date_modified"`
		Authors       []string `json:"authors"`
		Language      string   `json:"language"`
	}

	type jsonFeed struct {
		Version     string      `json:"version"`
		Title       string      `json:"title"`
		HomePageUrl string      `json:"home_page_url"`
		FeedUrl     string      `json:"feed_url"`
		Description string      `json:"description"`
		Favicon     string      `json:"favicon"`
		Language    string      `json:"language"`
		Items       []jsonEntry `json:"items"`
	}

	jsonEntries := []jsonEntry{}
	for _, item := range items {
		dateModified := item.Date
		if !item.LastMod.IsZero() {
			dateModified = item.LastMod
		}
		jsonEntries = append(jsonEntries, jsonEntry{
			Id:            fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			Url:           fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			Title:         item.Title,
			ContentHtml:   content[item.Slug],
			Summary:       item.Description,
			DatePublished: item.Date.Format(time.DateOnly),
			DateModified:  dateModified.Format(time.DateOnly),
			Authors:       []string{"noClaps"},
			Language:      "en",
		})
	}

	feed := jsonFeed{
		Version:     "https://jsonfeed.org/version/1.1",
		Title:       "The Blog of Random",
		HomePageUrl: "https://blog.zerolimits.dev",
		FeedUrl:     "https://blog.zerolimits.dev/feed.json",
		Description: "A blog about the most random things you can think of.",
		Favicon:     "https://blog.zerolimits.dev/favicon.ico",
		Language:    "en",
		Items:       jsonEntries,
	}

	out := bytes.Buffer{}
	enc := json.NewEncoder(&out)
	enc.SetEscapeHTML(false)

	err := enc.Encode(feed)
	if err != nil {
		return "", err
	}
	return out.String(), err
}

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

func rssFeed(items []utils.Post, content map[string]string, lastUpdate time.Time) (string, error) {
	type Link struct {
		Rel  string `xml:"rel,attr"`
		Href string `xml:"href,attr"`
		Type string `xml:"type,attr"`
	}
	type Entry struct {
		XMLName     xml.Name `xml:"item"`
		Author      string   `xml:"dc:creator"`
		Description string   `xml:"description"`
		Guid        string   `xml:"guid"`
		Link        string   `xml:"link"`
		PubDate     string   `xml:"pubDate"`
		Title       string   `xml:"title"`
		Content     string   `xml:"content:encoded"`
	}
	type Channel struct {
		Description   string  `xml:"description"`
		Link          string  `xml:"link"`
		Title         string  `xml:"title"`
		Docs          string  `xml:"docs"`
		Language      string  `xml:"language"`
		LastBuildDate string  `xml:"lastBuildDate"`
		PubDate       string  `xml:"pubDate"`
		AtomLink      Link    `xml:"atom:link"`
		Entries       []Entry `xml:",innerxml"`
	}
	type Feed struct {
		XMLName      xml.Name `xml:"rss"`
		Version      string   `xml:"version,attr"`
		XMLNsContent string   `xml:"xmlns:content,attr"`
		XMLNsDc      string   `xml:"xmlns:dc,attr"`
		XMLNsAtom    string   `xml:"xmlns:atom,attr"`
		Channel      Channel  `xml:"channel"`
	}

	rssEntries := []Entry{}
	for _, item := range items {
		pubDate := item.Date
		if !item.LastMod.IsZero() {
			pubDate = item.LastMod
		}
		rssEntries = append(rssEntries, Entry{
			Author:      "noClaps",
			Description: item.Description,
			Guid:        fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			Link:        fmt.Sprintf("https://blog.zerolimits.dev%s", item.Slug),
			PubDate:     pubDate.Format(time.RFC1123Z),
			Title:       item.Title,
			Content:     html.EscapeString(content[item.Slug]),
		})
	}

	feed := Feed{
		Version:      "2.0",
		XMLNsContent: "http://purl.org/rss/1.0/modules/content/",
		XMLNsDc:      "http://purl.org/dc/elements/1.1/",
		XMLNsAtom:    "http://www.w3.org/2005/Atom",
		Channel: Channel{
			Description:   "A blog about the most random things you can think of.",
			Link:          "https://blog.zerolimits.dev",
			Title:         "The Blog of Random",
			Docs:          "https://www.rssboard.org/rss-specification",
			Language:      "en",
			LastBuildDate: lastUpdate.Format(time.RFC1123Z),
			PubDate:       lastUpdate.Format(time.RFC1123Z),
			AtomLink: Link{
				Rel:  "self",
				Href: "https://blog.zerolimits.dev/feed.rss",
				Type: "application/rss+xml",
			},
			Entries: rssEntries,
		},
	}

	xml, err := xml.Marshal(feed)
	if err != nil {
		return "", err
	}
	return string(xml), nil
}

func Feed() (feeds, error) {
	items, err := utils.GetPosts()
	if err != nil {
		return feeds{}, err
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
			return feeds{}, err
		}
		html, err := znak.Render(item.Content, theme)
		if err != nil {
			return feeds{}, err
		}
		content[item.Slug] = html
	}

	json, err := jsonFeed(items, content)
	if err != nil {
		return feeds{}, err
	}
	rss, err := rssFeed(items, content, lastUpdate)
	if err != nil {
		return feeds{}, err
	}
	atom, err := atomFeed(items, content, lastUpdate)
	if err != nil {
		return feeds{}, err
	}

	return feeds{
		Json: json,
		Rss:  rss,
		Atom: atom,
	}, nil
}
