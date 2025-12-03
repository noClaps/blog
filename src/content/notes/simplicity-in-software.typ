#import "../../pages/macros.typ": *

#let title = [Simplicity in Software]
#let date = datetime(year: 2024, month: 12, day: 5)

There's been a lot of products coming out recently with all these fancy new features. You have #link("https://arc.net")[Arc] (which recently got #link("https://www.youtube.com/watch?v=E9yZ0JusME4")[put into maintenance mode]), #link("https://cursor.com")[Cursor], #link("https://zed.dev")[Zed] (which I use), #link("https://www.diabrowser.com")[Dia] (a new browser from the Arc team), etc. I'm sure you've seen at least some of these kinds of products around somewhere on the internets.

One thing I've seen all of these have in common is that they try to do so much all in one product. Arc wanted to be your entire OS, despite being primarily a browser. Zed wants to put collaboration, AI, and code editing all into one product. I'm honestly not even sure what Dia is trying to do. Of course, this isn't anything new, apps have been trying to be all-in-one for a long, long time, and I'm sure they'll keep on trying for as long as there's people willing to pay for them.

I think software can be, and should be, simpler than that. There's an idea in software development called the UNIX philosophy, which talks about simplicity in software.

= The UNIX Philosophy

#quote(
  title: [UNIX Time-Sharing System: Foreword by McIlroy, Pinson and Tague],
  href: "https://archive.org/details/bstj57-6-1899/mode/2up",
)[
  1. Make each program do one thing well. To do a new job, build afresh rather than complicate old programs by adding new "features."

  2. Expect the output of every program to become the input to another, as yet unknown, program. Don't clutter output with extraneous information. Avoid stringently columnar or binary input formats. Don't insist on interactive input.

  3. Design and build software, even operating systems, to be tried early, ideally within weeks. Don't hesitate to throw away the clumsy parts and rebuild them.

  4. Use tools in preference to unskilled help to lighten a programming task, even if you have to detour to build the tools and expect to throw some of them out after you've finished using them.
]

The UNIX philosophy was made in the 1970s, specifically for the UNIX system, where most programs were CLI tools that could "pipe" into each other to create these extremely complex workflows. You could do fun stuff like this:

```sh
ls ~/Programming/**/*.md | grep README | xargs wc
```

which looks for all the files in your `Programming` directory with the `.md` extension, searches the results for `README` in the filename, and prints the word count for those filtered results. When would you use this? Probably never. But it is pretty fun.

= The modern world

Of course, we've moved on from CLIs, and now everything is a graphical user interface with windows everywhere. Our needs and wants from our systems are far more complex than they were back then. Surely, then, the same ideas from the 70s can't apply, right?

In a sense, yes. Take browsers, for example. There's a _lot_ of parts to a browser, from the rendering engine that shows you the website, the JS engine that makes it functional, the network and security stacks that allow you to connect to the internet securely, and so much more. Point is, we do live in a different world than we did in 1978. But I don't think that means we have to abandon the UNIX philosophy, we just have to adapt it to the world we live in today.

Some of those ideas do translate over fairly well. For instance, the last point, taking that detour is just an opportunity to learn a different way of doing things, and it'll probably be useful in some way or another in the future, or at the very least it'll allow you to show off how to find all the word counts of all the `README.md` files in your `Programming` directory.

Some are already in use today, like the third point is pretty much just "Move fast and break things". That doesn't mean ship broken software (looking at you, video game companies and Microsoft), it means iterate quickly, and don't be afraid to discard and rewrite the parts that are holding you back.

And finally, some are just too specific to be taken literally, but we can still adapt them into something useful. The second point is just too specific to apply to most situations, but it teaches us an important lesson about interoperability between programs and systems.

== Do one thing well

However, I want to talk about the first point, "do one thing well". I put it in its own section because I have a _lot_ of thoughts on the products that have been coming out recently.

As I mentioned before, a lot of products nowadays seem to want to take over your entire life, or some aspect of it. Let's take the browser, its primary purpose is to allow the user to browse the internet. It should have features like tabs, bookmarks, extensions, themes, etc., to enhance that browsing experience. So then, why does my browser need to collect data about my browsing habits to show me "more relevant" ads? Why do I need an AI following me around wherever I go on the internet? Why is there an entire cryptocurrency wallet built into my browser? Why do I need to _log in_ to a browser?

Think about this like a terminal. Just like a browser is an interface to the web, the terminal is an interface to the command line and the tools built into your system. Sure, they're different enough that it's not really a fair comparison, but think about it, how would you feel if every command was logged and sent off to some external server so that companies could more effectively sell you their tools? How would you feel if you had to _log in_ to access your own computer's command line?

Of course, terminals haven't escaped this entirely, given that #link("https://warp.dev")[Warp] required an account for the longest time, before #link("https://www.warp.dev/blog/lifting-login-requirement")[lifting it] a week and a half ago, _2 years after their initial release_. You couldn't use Warp without logging in for 2 whole years. And of course, as with pretty much everything released in the last few years, it had an AI following you around your terminal so it could help you.

I'm not sure what the big deal is with AI. The technology is cool, and it's useful in certain situations, but I'm not sure sticking it literally everywere, purely for style points, is necessarily the best idea. Because of how our current AIs work, they can not only give us incorrect responses, but they can give them with the confidence of an expert in the field. And of course, the excuse given for that is "oh it's AI, it's still in its early stages, and it might hallucinate sometimes". Why would you pay for a product like that?

You see it in code editors, too, now. I use Zed, which has also gone deep down that AI rabbit hole. They also have other features built-in to the editor, like a chatting platform and calls. All of that combines to give a very bloated feel to Zed, at least when you first launch it. Luckily, you can turn most of those things off, or at least hide them away, and the real reason I use Zed is that it's really, really fast. The team behind it cares about performance, and it shows with how amazingly (some may even say, blazingly) fast it is.

But beyond performance, and LSP and Tree-sitter integration, I don't really care about any of Zed's features. All I want is a code editor that lets me write code effectively, just like all I want is a browser that lets me browse the web effectively, and I want a terminal that lets me access my computer's command line effectively. Just let me do the thing I bought/installed you to do.

Or in other words, do one thing well.

= Conclusion

This post was kind of a rant, and I'd be amazed if you got all the way here. If you did, hi, here's a cookie 🍪. Don't worry, this one won't track you.

I've talked about #link("./minimalism")[minimalism] in another post, and this kinda extends that post into the tech world. I'm aware that other people probably find these features useful in their daily lives, but that's not really my workflow, and I'm sure that I'm not the only one that's been frustrated by the lack of simplicity in software nowadays. There's a lot of changes I'd like to see in the way that software is developed today, and honestly, if I can't find something that works how I want, I might just make it myself.

That said, I'd like to highlight the #link("https://ladybird.org")[Ladybird browser] as a project that looks like it's gonna be just a browser and not much more, which I'm quite excited about. There's also #link("https://mitchellh.com/ghostty")[Ghostty] that's apparently due to release soon, and it looks like it's a really good terminal emulator and not much more. Both of these embody pretty much exactly my argument in this post, they both (seem to, I haven't tried either) _do one thing well_.
