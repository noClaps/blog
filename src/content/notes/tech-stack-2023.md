---
title: Textack - 2023
date: 2023-12-06
---

I've learned a lot about different things over this last year, and I thought I'd share some of the tools and things I've been using, and maybe talk a little bit about what I plan to use next year, in 2024.

## Hardware

At the beginning of this year, I was using a Lenovo IdeaPad S340 with Fedora. I then moved to Windows around April, and finally got a MacBook Air M2 in August, and I've been using it since. macOS has been amazing for me so far, significantly better than Windows or Linux were (in fact, I wrote a [whole post about Windows and Linux](/tech/operating-systems), and operating systems in general.), and I've been able to get a lot more work done on it. I've started editing photos again, and I'd say my design skills have also gotten better than they were earlier this year. Overall, pretty happy with this purchase.

I also use my phone to take all of the photos that you see on [Aperturic Focus](https://gallery.zerolimits.dev), except for a few that I took using a DSLR. I don't remember the exact camera model, just that it was a Canon. Most new photos that you see on there will likely be taken on my phone.

## Software

I use Luminar AI to edit my photos. Most of my older photos aren't edited, but the newer ones are, and future ones will probably be too. While other photo editors like Photoshop, Affinity or GIMP may give me more control over the edits, they can quickly become too complicated. Since editing photos isn't something I'd like to pursue professionally, I think I'm pretty happy sticking with something a bit more basic like Luminar. I'm still a little bit upset that there's no more updates for Luminar AI, but whatever.

For writing code, I use Visual Studio Code. As much as I'd like to use Vim (or Neovim), I'm still learning the keybinds and shortcuts for it, and I'm simply more comfortable with VSCode at the moment. That being said, I have tried using Vim before and enjoyed it quite a bit. I especially miss `dd` to delete a whole line. Although I don't use Vim shortcuts in VSCode, I still do try to use the keyboard to navigate around and edit as much as possible.

Another nice thing about VSCode is that a lot of tools officially support it, for instance, the Astro and Markdoc plugins. Having officially supported plugins for your editor is quite nice, since things tend to be up-to-date and bugs are a lot easier to report when you know who to report them to.

### Languages

I mainly use TypeScript, Python, C and Bash for most programming that I do. I mostly use C to solve [Project Euler problems](https://gitlab.com/noClaps/project-euler), Bash to write basic scripts to automate stuff, Python for university work and TypeScript for both Project Euler and web development. I've also used Dart and Swift before, but don't have much experience in either. You can see most of the scripts and stuff I've made in my [coding playground](https://gitlab.com/noClaps/playground).

I use the Python and Clang that come with Xcode, although I don't use Xcode itself. I have found the tools around C to be a bit lacking, though, which pushes me towards Swift. However, the simplicity and power of C keeps bringing me back. I will fully transition to Swift at some point, once I can find some proper editor tooling for it. Hopefully Fleet does better in this regard than VSCode does.

### Web development tools

[Astro](https://astro.build) was my web framework of choice for 2023, and will likely be my first choice going forward. Writing Astro really just feels like writing HTML, CSS and TypeScript, and getting a fully-functioning and well-optimised site out of it. It's also super easy to work with, and their [documentation](https://docs.astro.build) is by far the best I've seen of any project. Astro is a meta-framework, which means you can mix and match things from different frameworks and they'll all play nicely, and even though I don't really use anything other than Astro, it's still nice to have and work with.

I also used SCSS for a lot of my sites early on, especially when CSS nesting wasn't really a thing. However, once I discovered that browsers natively supported CSS nesting, I moved off of SCSS and to plain old CSS. However, in situations where I'm building a site for something else, like with [Ulquiorra](https://ucp.mester.info) or [Gedanken Versichert](https://gedankenversichert.com), I still use SCSS since it has better support for other browsers, as well as better polyfill.

Until late November, I was mainly using [PNPM](https://pnpm.io) as my package manager. However, once Sharp 0.33.0 was released with proper support for [Bun](https://bun.sh). I've been following Bun for a while now, even trying out some of their betas, and I've quite enjoyed the speed that it offers in basically everything. It's the fastest I've seen my programs run without diving into compiled land. I'm definitely going to keep using Bun, at least until something even better comes along.

I moved my website to a monorepo earlier this year, and for that I used [Turborepo](https://turbo.build). It works great and ties in really nicely with Vercel, where I'm currently hosting my websites.

I recently started using [HTMX](https://htmx.org), and I've found it very fun to work with. I don't really have much experience with it so far, but I've been working on a [snakes and ladders game](https://snakes-and-ladders.zerolimits.dev) that uses it. There's a good chance that this game will remain unfinished, either due to me getting bored of it or frustrated with why it's not working how I want it to. I'll probably archive it if that happens, and the link above will stop working. If any of the links aren't working on my site(s), please let me know.

## The future

Here's some things that I want to do in the future, whether in 2024 or beyond:

- I want to get off of VSCode at some point, and hopefully move on to a better editor. I'm keeping an eye on [Zed](https://zed.dev) and [Fleet](https://www.jetbrains.com/fleet), since they look interesting to me. If I can get Neovim working for me, then I'd be more than happy to use that too.
- I plan on sticking to macOS for as long as I can, and eventually getting more into the Apple ecosystem, most likely with an iPhone. I don't really like buying a lot of things, so I reckon a laptop, mouse, phone and headphones should be enough tech for me to do 90% of the things I need to do.
- I want to learn more low-level programming concepts. This is mostly because I'm a speed freak, and will spend hours trying to squeeze every drop of performance out of a program that I've written. I feel like I can't get very far with that at the moment, and learning how stuff works at a lower level will help me understand how I can optimise stuff even better. Plus, being able to understand those concepts will also help a lot in learning and doing stuff at a higher level, as I'll have a better idea of what my code is actually doing, and how I can make it better.
- I want to get into app development. I'll probably be making apps for Apple platforms, since Swift feels a lot nicer to use than Java or Kotlin, and I can use the same codebase for iOS, iPadOS and macOS. I'm not fully sure if I want to earn money from this or just do it for fun, but it is something I want to do at least a little bit.
- I want to make my own static site generator. Although I like Astro, I feel like it offers more features than I could possibly need. I like having as few dependencies as possible, and most JavaScript-based frameworks don't really do that too well. I'll probably end up writing the generator in TypeScript too, but I'll try my best to have as few dependencies as I possibly can. I'll also try to use the fastest and most optimised tools available, and stick to web standards as much as possible. I have no clue how easy or difficult this will be, but I'm excited to try.
- I want to start self-hosting at some point, most probably in a VPS or something. Even though I don't really own the servers, I feel like I'll have more control compared to, say, hosting on Vercel or Netlify or something.
- Although using Turborepo is handy, I'm considering moving back to having separate repositories for my different websites. I can share layouts and components with a simple GitHub repo, so I don't even have to publish it to NPM. This will also allow me to use components that I made for my own site, in other sites that I make.
- I want to get back into designing things, and possibly start making themes and stuff for Astro. There's a lot of cool tools for design, like [Realtime Colors](https://realtimecolors.com) and [Stack Sorted](https://stacksorted.com) (both made by Juxtopposed!), and I'd like to utilise them for my designs. I also want to get better at typography and picking the right fonts for different designs. I know that [Fontshare](https://fontshare.com) has a lot of really nice fonts and I'd like to be able to use them.

## Conclusion

Anyway, it's been quite an interesting year for me, and I've learned a lot of new things like monorepos, server-side rendering, HTMX, etc. As you can see, I've got a pretty long list of things I want to do in the future, and I can't wait to start crossing things off that list.

Stay tuned for more notes and posts, and for another Textack (I need a better name for this) post next year.
