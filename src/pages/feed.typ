#context {
  let entries = sys
    .inputs
    .data
    .split(" ")
    .map(it => {
      let slug = it.slice(12, -4)
      let c = include "../content/" + slug + ".typ"
      let meta = c.children.find(it => repr(it).starts-with("metadata")).value

      let updated = if "lastmod" in meta { meta.lastmod } else { meta.date }
      (
        updated,
        "<entry><id>https://blog.zerolimits.dev/"
          + slug
          + "</id><title>"
          + meta.title
          + "</title><updated>"
          + updated.display()
          + "</updated><link rel=\"alternate\" href=\"https://blog.zerolimits.dev/"
          + slug
          + "\" /><published>"
          + meta.date.display()
          + "</published>"
          + "</entry>",
      )
    })

  let lastmod = datetime(year: 1970, month: 1, day: 1)
  let entry-content = ()
  for (date, content) in entries {
    if date > lastmod {
      lastmod = date
    }
    entry-content.push(content)
  }
  let entries = entry-content.join()

  (
    "<?xml version=\"1.0\" encoding=\"utf-8\"?><feed xmlns=\"http://www.w3.org/2005/Atom\"><id>https://blog.zerolimits.dev/</id><title>The Blog of Random</title><updated>"
      + lastmod.display()
      + "</updated><link rel=\"self\" href=\"https://blog.zerolimits.dev/feed.atom\" /><icon>https://zerolimits.dev/cookie.png</icon><subtitle>A blog about the most random things you can think of.</subtitle><author><name>noClaps</name><uri>https://zerolimits.dev</uri></author>"
      + entries
      + "</feed>"
  )
}
