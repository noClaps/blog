---
title: Simplicity in Software
date: 2024-12-02
---

## Do everything okay

There's been a lot of products coming out recently with all these fancy new features. You have [Arc](https://arc.net) (which recently got put into maintenance mode), [Cursor](https://cursor.com), [Zed](https://zed.dev) (which I use), [Dia](https://www.diabrowser.com) (a new browser from the Arc team), etc. I'm sure you've seen at least some of these kinds of products around somewhere on the internets.

One thing I've seen all of these have in common is that they try to do so much all in one product. Arc wanted to be your entire OS, despite being primarily a browser. Zed wants to put collaboration, AI, and code editing all into one product, and I'm honestly not even sure what Dia is trying to do. To be clear, this isn't anything new, apps have been trying to be all-in-one for a long, long time, and I'm sure they'll keep on trying for as long as there's people willing to pay for them.

The title of this section is a play on UNIX's "do one thing well". Here's the full thing:

::: quote UNIX Time-Sharing System: Foreword by McIlroy, Pinson and Tague {href="https://archive.org/details/bstj57-6-1899/mode/2up"}

1. Make each program do one thing well. To do a new job, build afresh rather than complicate old programs by adding new "features."
2. Expect the output of every program to become the input to another, as yet unknown, program. Don't clutter output with extraneous information. Avoid stringently columnar or binary input formats. Don't insist on interactive input.
3. Design and build software, even operating systems, to be tried early, ideally within weeks. Don't hesitate to throw away the clumsy parts and rebuild them.
4. Use tools in preference to unskilled help to lighten a programming task, even if you have to detour to build the tools and expect to throw some of them out after you've finished using them.

:::

This was made in the 1970s, specifically for the UNIX system, where most programs were CLI tools that could "pipe" into each other to create these extremely complex workflows. You could do fun stuff like this:

```sh
ls ~/Programming/**/*.md | grep README | xargs wc
```

which looks for all the files with the `.md` extension, searches the results for `README` in the filename, and prints the word count for those filtered results. When would you use this? Probably never. But it is pretty fun.

## The modern world

However, we've evolved past the old days of CLI, and now we have a GUI app or website for everything. Programming is complicated, and computers are complicated, and drawing pixels on a screen sounds extraordinarily difficult. Surely, the same idea from the 70s can't apply, right?

In a sense, yes. Take browsers, for example. There's a _lot_ of parts to a browser: there's the HTML engine that parses HTML from text into a structure that the browser can work with, the CSS engine that reads and understands CSS files that make a website's design, and the JS engine that parses JavaScript (sorry, ECMAScript, [please don't sue me Oracle](https://javascript.tm)). Then you have the renderer that puts that all together, to put stuff on the screen. _And_ it has to do all of that in the blink of an eye so that you, the user, don't notice that so much has happened.

Oh, you thought that was it? You're forgetting about the entire network stack so that you're able to connect to and open websites other than whatever's running on your computer, the WASM engine that runs a lot of web apps nowadays, all the different APIs that allow you to access device features like the camera, all while having a strong enough sandbox to keep any code running _inside_ the browser from leaking _outside_ and potentially destroying your system. Oh, and there's the entire security stack to allow for HTTPS, and to make sure that one tab can't steal data from other tabs, and so on.

I'm could go on and on about all the different parts of a browser, and I'd still probably miss a few. Point is, we do live in a different world than we did in 1978. But I don't think that means we have to abandon that philosophy of "do one thing well", we just have to adapt it to the world we live in today.

## Translation

Let's go through each point in the original UNIX philosophy, and see how it translates to today:

1. **Use tools in preference to unskilled help to lighten a programming task, even if you have to detour to build the tools and expect to throw some of them out after you've finished using them.**

   I'm sure people still do this today. Even if you're not a programmer, there's probably been a time in your life when you spent like 5 hours working on something on the side to save 20 minutes on the main task at hand. Now, I don't think that's exactly what the original idea was for this, but it did lead to a really funny xkcd:

   ![xkcd 1205 – Is it worth the time? Source: [https://xkcd.com/1205](https://xkcd.com/1205)](https://imgs.xkcd.com/comics/is_it_worth_the_time.png)

   I sometimes take those detours, and yeah, sometimes I end up never using them again, but I learned how to make that task more efficient. There were new things I learned during that detour, that might end up speeding other things I do a lot more, or I can use them in some other projects. And sure, I "wasted" 4 hours and 40 minutes here, but I probably saved a whole lot more time overall than if I hadn't learned how those tools work.

   Or at the very least I can show off how to find all the word counts of all the `README.md` files in my `Programming` directory.

2. **Design and build software, even operating systems, to be tried early, ideally within weeks. Don't hesitate to throw away the clumsy parts and rebuild them.**

   Before you get mad that "this is what causes games and software to release so broken!!1!", I don't think the idea here is to _release_ it early. Notice how they say "to be tried early", that means for testing. It's the same idea behind "Move fast and break things", it's to iterate quickly and discard the parts that are clearly holding you back, rebuilding them from the ground up to be better.

   I like this, there's something nice about always looking at something that's new and has been updated recently. Of course, the irony of saying that about something that was written 46 years ago is not lost on me, but we _are_ allowed to build on old ideas. I just think we can tune it up a bit, modernise it.

   This is especially important when we're now at a point in tech where we have systems and code that are older than the people maintaining it. There's ideas that were written back then, but time showed us that those ideas maybe weren't the best, but because it's so deeply ingrained in the system it's hard to just get rid of it. That's called "tech debt". By constantly iterating and reevaluating our previous decisions (and not letting our egos get in the way. It's okay to be wrong!), we can move forward much faster and more easily.

3. **Expect the output of every program to become the input to another, as yet unknown, program. Don't clutter output with extraneous information. Avoid stringently columnar or binary input formats. Don't insist on interactive input.**

   Okay, I'll admit this is a bit specific to CLI tools, but there's a greater idea here. By allowing every program to interoperate with every other program, you get rid of lock-in entirely. Think about it, how nice would it be if you could start working on a project in Apple Pages on your MacBook, then go into work and just continue working on it in Microsoft Word on your Windows computer, have a look at it in Google Docs on your Android phone, and once its done, deploy it to a Linux server to be accessible on a website?

   Most of the time, getting something to go through all of those platforms is gonna break something or the other. Fonts, positioning, colors, something will change every time you move from one software to another, and don't even think about what deploying a `DOCX` file to a website would look like.

   I realise that most workflows like this depend on some kind of central service, like Dropbox or GitHub, but what happens when that service goes down? Being completely dependent on another company for that interoperability _is_ lock-in, you're just locked in to that central service rather than any one ecosystem.

### Do one thing well

And finally, the big one. I saved this one for last, and put it in its own section, because I have a _lot_ of thoughts on the products that have been coming out recently. I've talked about this a little bit in my post about [minimalism](./minimalism#the-unix-philosophy), but I wanted to expand on it a bit more. Of course, since this is a Note, this is all entirely my opinion and you're free to disagree with me, as I'm sure some of you will.

As I mentioned before, a lot of products nowadays seem to want to take over your entire life, or some aspect of it. Let's take the browser, since it's the environment I'm most familiar with. Browsers are inherently complex pieces of software, but from a user's point of view, they're supposed to do one thing: fetch a website and display it. The user doesn't know, or care, about the inner mechanisms of how that's happening, they just want to get their cat picture of the day.

And sure, there's some features on top of just that interaction that are nice to have, like tabs, bookmarks, extensions, themes, etc., and they enhance the browsing experience for the user, so we can throw those in as necessary features. But why does my browser need to collect data about my browsing habits to show me "more relevant" ads? Why do I need an AI following me around wherever I go on the internet? Why is there an entire cryptocurrency wallet built into my browser? Why do I need to _log in_ to a browser?

Think about this like a terminal. Just like a browser is an interface to the web, the terminal is an interface to the command line and the tools built into your system. Sure, they're different enough that it's not really a fair comparison, but think about it, how would you feel if every command was logged and sent off to some external server so that companies could more effectively sell you their tools? How would you feel if you had to _log in_ to access your own computer's command line?

Of course, terminals haven't escaped this entirely, given that [Warp](https://warp.dev) required an account for the longest time, before [lifting it](https://www.warp.dev/blog/lifting-login-requirement) a week and a half ago, _2 years after their initial release_. You couldn't use Warp without logging in for 2 whole years. And of course, as with pretty much everything released in the last few years, it had an AI following you around your terminal so it could help you.

I don't know what's with the whole AI thing. I'm not against the technology, it's definitely useful in some places, but I don't see the point in sticking it literally everywhere, purely for style points, only to find out that it actually doesn't work that well in that domain. Of course, the excuse that's always given is "oh it's AI, it's still in its early stages, and it might hallucinate sometimes" Think for a moment, why would you repeatedly pay for a product that might not work sometimes? Not only does it not work, it gives you an incorrect answer, with the confidence of someone that's an expert in that field, so if you're inexperienced you have no way of verifying if it's lying or not.

You see it in code editors, too, now. All the new players, like Cursor, Zed, Windsurf, etc., (half of which are VSCode clones), and some older ones like VSCode, are all super deep on AI. Without it, Cursor and Windsurf don't really have much to stand on their own, and again, this is a product that requires you to log in and be connected to the internet, and still only works _sometimes_. Zed, while having gone deep down that AI hole, also has other things going for it, like the collaboration features. You can have calls, messages, all forms of conversation on Zed. It's also really, really fast.

That last point is why I use Zed. The team behind it care about performance, and it shows with how amazingly (some may even say, blazingly) fast it is. Beyond that, LSP integration and Tree-sitter, I don't really care about any of Zed's features. All I want is a code editor that lets me write code effectively, just like all I want is a browser that lets me browse the web effectively, and I want a terminal that lets me access my computer's command line effectively. Just let me do the thing I bought/installed you to do.

Or in other words, do one thing well.

### Conclusion

This post was kind of a rant, and I'd be amazed if you got all the way here. If you did, hi, here's a cookie 🍪 for getting all the way here. Don't worry, this one won't track you.

I've already talked about how I'm a [minimalist](./minimalism), and this kinda extends that post into the tech world. I'm aware that a lot of people probably find many of these features useful in their daily lives, but that's not really my workflow, and I'm also sure that I'm not the only one that's been frustrated by all the bloated software. Everyone acting like GPT is the next big thing and so should be put everywhere doesn't help either.

Obviously, these are all my thoughts on the topic, you're free to disagree and let me know about it. I think there's a lot of changes that I'd like to see being made in the software being made today, and honestly, I might make some of them myself. That said, I'd like to highlight the [Ladybird browser](https://ladybird.org) as a project that looks like it's gonna be just a browser and not much more, which I'm quite excited about. There's also [Ghostty](https://mitchellh.com/ghostty) that's apparently due to release soon, and it looks like it's a really good terminal emulator and not much more. Both of these pretty much embody exactly my argument in this post, they both (seem to, I haven't tried either) _do one thing well_.
