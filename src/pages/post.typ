#let post(body) = context {
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

  let metadata = query(metadata).first().value
  let title = metadata.title
  let date = metadata.date

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

#let quote(title: none, href: none, body) = {
  if title == none { title = [QUOTE] }
  html.div(class: "blog-container quote", {
    html.p(class: "quote-heading", {
      html.b(if href == none {
        title
      } else if href.starts-with("https") {
        html.a(target: "_blank", rel: ("noreferrer", "noopener"), href: href, title)
      } else {
        html.a(href: href, title)
      })
    })
    body
  })
}

#let note(title: none, href: none, body) = {
  if title == none { title = [NOTE] }
  html.div(class: "blog-container note", {
    html.p(class: "note-heading", {
      html.b(if href == none {
        title
      } else if href.starts-with("https") {
        html.a(
          target: "_blank",
          rel: ("noreferrer", "noopener"),
          href: href,
          title,
        )
      } else {
        html.a(href: href, title)
      })
    })
    body
  })
}

#let warning(title: none, href: none, body) = {
  if title == none { title = [WARNING] }
  html.div(class: "blog-container warning", {
    html.p(class: "warning-heading", {
      html.b(if href == none {
        title
      } else if href.starts-with("https") {
        html.a(
          target: "_blank",
          rel: ("noreferrer", "noopener"),
          href: href,
          title,
        )
      } else {
        html.a(href: href, title)
      })
    })
    body
  })
}
