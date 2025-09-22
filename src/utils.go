package utils

import (
	"embed"
	"fmt"
	"io/fs"
	"time"

	"tangled.org/zerolimits.dev/znak"
	"tangled.org/zerolimits.dev/znak/highlight"
)

type Post struct {
	Slug    string
	Title   string
	Date    time.Time
	LastMod time.Time
	Content string
}

type frontmatter struct {
	title   string
	date    string
	lastmod string
}

func parseFrontmatter(parsed map[string]string) (frontmatter, error) {
	title, ok := parsed["title"]
	if !ok {
		return frontmatter{}, fmt.Errorf("Title not found: %v", parsed)
	}
	date, ok := parsed["date"]
	if !ok {
		return frontmatter{}, fmt.Errorf("Date not found: %v", parsed)
	}
	lastmod, ok := parsed["lastmod"]
	if !ok {
		lastmod = ""
	}

	return frontmatter{title, date, lastmod}, nil
}

//go:embed content
var content embed.FS

func GetPosts() ([]Post, error) {
	files, err := fs.Glob(content, "content/**/*.md")
	if err != nil {
		return nil, err
	}

	data := []Post{}
	for _, file := range files {
		md, err := content.ReadFile(file)
		if err != nil {
			return nil, err
		}

		// Exclude `content` from start and `.md` from end
		slug := file[len("content") : len(file)-len(".md")]
		fmMap, err := znak.ParseFrontmatter(string(md))
		if err != nil {
			return nil, err
		}
		fm, err := parseFrontmatter(fmMap)
		if err != nil {
			return nil, err
		}

		date, err := time.Parse(time.DateOnly, fm.date)
		if err != nil {
			return nil, err
		}
		lastmod, err := time.Parse(time.DateOnly, fm.lastmod)
		if err != nil {
			lastmod = time.Time{}
		}

		data = append(data, Post{
			Slug:    slug,
			Title:   fm.title,
			Date:    date,
			LastMod: lastmod,
			Content: string(md),
		})
	}
	return data, nil
}

//go:embed styles/syntax.css
var themeFile embed.FS

func GetTheme() (highlight.Theme, error) {
	themeFile, err := themeFile.ReadFile("styles/syntax.css")
	if err != nil {
		return highlight.Theme{}, err
	}
	theme, err := highlight.NewTheme(themeFile)
	if err != nil {
		return highlight.Theme{}, err
	}
	return theme, nil
}
