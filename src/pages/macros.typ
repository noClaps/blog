#let quote(title: none, href: none, body) = {
  if title == none { title = [QUOTE] }
  html.div(class: "znak-container quote", {
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
  html.div(class: "znak-container note", {
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
  html.div(class: "znak-container warning", {
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
