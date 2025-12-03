#let files = (
  eval(sys.inputs.files)
    .map(it => {
      import "../content/" + it + ".typ" as data
      include "../content/" + it + ".typ"
      return (
        slug: it,
        title: data.title,
        date: data.date,
      )
    })
    .sorted(key: it => it.date, by: (l, r) => l >= r)
)

#let posts = files.filter(it => it.slug.starts-with("posts"))
#let notes = files.filter(it => it.slug.starts-with("notes"))
#let stories = files.filter(it => it.slug.starts-with("stories"))

#html.html(
  lang: "en",
  {
    html.head({
      html.link(rel: "icon", href: "https://zerolimits.dev/cookie.png")
      html.title("The Blog of Random")
      html.meta(charset: "utf-8")
      html.meta(
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      )
      html.meta(
        name: "description",
        content: "A blog about the most random things you can think of.",
      )
      html.link(
        rel: "alternate",
        href: "/feed.atom",
        type: "application/atom+xml",
      )
      html.style({
        read("../styles/global.css")
        read("../styles/index.css")
      })
    })
    html.body({
      html.header({
        html.div()
        html.nav({
          html.a(href: "/feed.atom", title: "Feed", include "../assets/rss.typ")
          html.a(
            target: "_blank",
            rel: ("noopener", "noreferrer"),
            href: "https://github.com/noClaps/blog",
            title: "Source code",
            include "../assets/github.typ",
          )
        })
      })
      html.main({
        html.div(class: "title", {
          html.h1([The Blog of Random])
          html.p([A blog about the most random things you can think of.])
        })
        html.h2([Posts])
        html.section(
          id: "posts",
          posts
            .map(post => {
              html.a(href: "/" + post.slug, class: "link", {
                html.time(datetime: post.date, post.date.display())
                html.h3(post.title)
              })
            })
            .join(),
        )
        html.h2([Notes])
        html.section(
          id: "notes",
          notes
            .map(post => {
              html.a(href: "/" + post.slug, class: "link", {
                html.time(datetime: post.date, post.date.display())
                html.h3(post.title)
              })
            })
            .join(),
        )
        html.h2([Stories])
        html.section(
          id: "stories",
          stories
            .map(post => {
              html.a(href: "/" + post.slug, class: "link", {
                html.time(datetime: post.date, post.date.display())
                html.h3(post.title)
              })
            })
            .join(),
        )
      })
    })
  },
)
