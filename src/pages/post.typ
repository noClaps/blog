#{
  // TODO: Remove when Typst supports MathML
  show math.equation: html.frame
  show math.equation.where(block: false): html.span
  show math.equation: text.with(fill: rgb("#ccc"), stroke: 0.375pt + rgb("#ccc"))

  set raw(theme: none)

  show link: it => {
    if it.dest.starts-with("https") {
      html.a(target: "_blank", rel: ("noreferrer", "noopener"), href: it.dest, it.body)
    } else {
      html.a(href: it.dest, it.body)
    }
  }
  show heading: it => {
    html.elem(
      "h" + repr(it.level + 1),
      attrs: (id: lower(repr(it.body).slice(1, -1)).replace(regex("[^\w]"), "-")),
      it.body,
    )
  }

  let post = sys.inputs.post
  import "../content/" + post + ".typ" as content
  let title = content.title
  let date = content.date
  let body = include "../content/" + post + ".typ"

  html.html(lang: "en", {
    html.head({
      html.link(rel: "icon", href: "https://zerolimits.dev/cookie.png")
      html.title(title)
      html.meta(charset: "utf-8")
      html.meta(name: "viewport", content: "width=device-width, initial-scale=1.0")
      html.meta(name: "description", content: "A blog about the most random things you can think of.")
      html.style({
        read("../styles/global.css")
        read("../styles/post.css")
      })
    })
    html.body({
      html.header({
        html.h1(html.a(href: "/", [The Blog of Random]))
        html.nav({
          html.a(href: "/feed.atom", title: "Feed", include "../assets/rss.typ")
          html.a(
            target: "_blank",
            rel: ("noreferrer", "noopener"),
            href: "https://github.com/noClaps/blog",
            title: "Source code",
            include "../assets/github.typ",
          )
        })
      })
      html.main({
        html.div(class: "post-header", {
          html.time(datetime: date, date.display())
          html.h1(title)
        })
        html.article(body)
      })
    })
  })
}
