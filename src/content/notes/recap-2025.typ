#import "../../pages/post.typ": *

#metadata((
  title: [Recap - 2025],
  date: datetime(year: 2025, month: 12, day: 26),
))
#show: post

#link("./tech-stack-2024")[Last year's Textack]

Merry Christmas! Or happy Christmas, as I've just found out some people say that instead.

Yet another year has whizzed on by, and so much has happened around the world in this time. Some good things, way too many bad things, the whole deal. But Recap (yes, it's a new name I'm trying out) isn't about that, it's about me, and the stuff I've been using!

= Hardware

I've still got the same old MacBook Air M2 that I've had for a few years now. I updated to the latest macOS 26, and honestly it hasn't been too bad. It's definitely a bit strange UI-wise, not something I'm too fond of personally, but it's nothing I couldn't get used to. There's been a few developments in the Linux world this year that look interesting to me, and maybe I'll try them out at some point, but for now I'm still very happy with this laptop for my daily use.

I've also still got the same Google Pixel 6a, but my dad has an iPhone 11 Pro Max lying around that he wasn't using, so I'll start using that once I set it up. I'm annoyed at the OS update that Google pushed back in June, because it completely destroyed the amazing battery life I used to get on this phone, all in the name of "battery safety". My phone was doing just fine, it never overheated and lasted the whole day, now I'm not even sure I can get through 3 hours of the same usage. Hopefully the iPhone fares better.

My headphones are still the same Sony WH1000XM4's that I've been using for the last 4 years. They're still an amazing pair of headphones, and earlier this year I replaced the deteriorating ear pads too. I wouldn't say they're good as new, and I'll probably upgrade when the XM7s launch, but for now I'm not too upset about continuing to use them.

= Software

Last year, I talked about photo editing software, but this year I realised that most of my photos don't actually need all that much editing, and definitely not enough to warrant getting a whole separate app for it. All the photos I've uploaded to #link("https://gallery.zerolimits.dev")[Aperturic Focus] this year have been unedited for the most part, and the little bits of editing I did do were all using the built in tools in Apple Photos. I suppose that one of my goals was to decrease the amount of editing I did to my pictures, and I was successful in that.

For my editor, I've stayed with Zed for the most part, though I did use Neovim for a bit this year. I also re-did my editor theme, and it's a lot closer to other themes like Ayu or GitHub Dark, with a few additions or changes that I thought would look good. Here's what it looks like:

#figure(
  image("recap-2025/zed.png"),
  caption: [Part of the build script for this site],
)

Extension support has also gotten much better in Zed, and a lot more things just work now. I don't use that many extensions, but I haven't encountered any issues so far. The editor itself is also progressing really nicely, though it's now at the stage where it's adding features I don't particularly care for. Maybe at some point I'll fork it and make a stripped down version, but for now I just turn things off in settings.

I changed browsers this year, I'm now on #link("https://helium.computer")[Helium]. I went back and forth between Helium and Safari, and honestly I think I'll ultimately land on Safari once I switch to the iPhone, but as of writing this, I'm using Helium. I've tried other browsers too, like #link("https://orionbrowser.com")[Orion], but none of them appealed to me quite as much as these two.

Another thing that happened this year was that I moved my personal projects off of GitHub, three times. The first time, I moved them to #link("https://gitlab.com")[GitLab], the second time was #link("https://tangled.org")[Tangled], and finally I'm now on #link("https://codeberg.org")[Codeberg]. I don't think I have much reason to move away from Codeberg and back to GitHub, because nearly everything that works on GitHub works exactly the same here, and everything feels a lot snappier.

There's multiple reasons for my moving away, but the main ones are just that GitHub spends way too much money and time on their AI products, and the experience of using the platform has been worsening over time. Things that should load instantly take ages, there's weird UI bugs and quirks all over the place, and overall it feels like GitHub (or maybe Microsoft) just doesn't care as much about the people using the platform anymore. I don't know what's going on there, I just know that it annoyed me enough for me to look for alternatives. Hopefully Codeberg stays sustainable enough for me to keep using it.

== Languages

I barely used Python outside of assignments this year, but towards the end I started using it as a scripting language rather than a programming language, and it's worked well for that. For instance, the #link("https://codeberg.org/noClaps/gallery/src/commit/0873ca3285975b9ce96ce3b18a4def7a926c5792/main.py")[build script for Aperturic Focus] is a very simple Python script that uses BeautifulSoup and PyVips, and it seems to build everything faster than any of the solutions I've used before, including the Go one.

Speaking of fast, I finally properly learned Rust! There's probably quite a few things that I still don't know about it, but I've learned enough to be able to use it in real projects (like this blog, I'll talk more about it later), so I'm pretty satisfied with that. I found that the recommendations that everyone gave about reading the Rust Book didn't really help me, but just building things and figuring stuff out as I go helped me understand what's going on a lot more. Sure, maybe I'm doing some things wrong, but the programs run just fine and behave how I expect them to, and that's what matters and the end of the day.

I have still used Go for other projects, especially ones that required an HTTP server (like #link("https://codeberg.org/noClaps/serve")[```sh serve```]) or making HTTP requests (like #link("https://git.macco.dev/pkg-mngr/pkg")[```sh pkg```]). There's also projects like #link("https://codeberg.org/noClaps/monopack")[Monopack] which would really only work in Go because that's what #link("https://esbuild.github.io/")[esbuild] uses, and I couldn't find a similar Rust crate.

The last language I mainly used this year was TypeScript, and when #link("https://bun.com/blog/bun-joins-anthropic")[Bun got acquired by Anthropic], I decided that was probably a good time to switch away. I tried both Node (with PNPM) and Deno, but I didn't particularly like working with either one, and honestly with all the recent #link("https://about.gitlab.com/blog/gitlab-discovers-widespread-npm-supply-chain-attack/")[NPM supply] #link("https://www.paloaltonetworks.com/blog/cloud-security/npm-supply-chain-attack/")[chain attacks], I figured it was probably best if I moved away from the JavaScript ecosystem entirely. That's why I built Monopack as a wrapper around esbuild, and I now no longer have any JavaScript runtimes installed on my computer.

One of my goals last year was to stop using TypeScript, and in a way I can say I succeeded in that. I didn't quite go the WASM way that I intended to, but maybe this is better.

== CLI development tools

I mostly switched to Go and Rust for making CLI tools, mainly because they were easier to work in. I also made #link("https://codeberg.org/noClaps/applause")[Applause], a command line argument parser for Go. I used it for a while, but I've switched back to using `flag` for my Go-based CLI programs, and archived Applause. I didn't really make that many CLI tools in Rust, but the few that I did, I used #link("https://github.com/clap-rs/clap")[clap], which is the "standard".

== Blog development

I've removed the web development section because I actually didn't do much web dev this year. Instead, I'll talk about the development of this blog.

At the beginning of the year, the markup language I used for this blog was #link("https://codeberg.org/noClaps/znak")[Znak], which was written in TypeScript. I rewrote it in Go, and then in Rust, and added other libraries alongside it, including a syntax highlighting library that wraps #link("https://tree-sitter.github.io/tree-sitter")[Tree-sitter], and a basic HTML parser.

When Typst released their #link("https://typst.app/docs/changelog/0.13.0/#html-export")[initial HTML export], I was interested in using Typst for my blog, and when it reached a relatively stable point, I moved everything over. The posts on this blog (including this one) are all now written in Typst! Maybe I was a bit too premature in switching over, because it's definitely not perfect, and there's be some quirks here and there, but it works relatively well for something that's still behind a feature flag, and it'll only get better from here.

When I moved everything over, I deleted the code for the markup language parser, so now Znak is comprised of a Tree-sitter-based syntax highlighter, and an HTML parser, both of which I use in the build script for this site. There's been some discussion about #link("https://github.com/typst/typst/pull/7351")[Typst switching over to Tree-sitter] from #link("https://github.com/trishume/syntect")[syntect], but it doesn't really look like that's going to happen anytime soon, so for now I'm just rolling with my own solution until I can come up with something better.

= Life

I'll add this section so I can talk a bit about what's happening in my life. I won't be talking about anything _too_ personal, but I think it'll be nice to have a place to just reflect on the year.

This year has been... chaotic, to say the least. I'm in my final year of university now, and the first few months have been quite busy. 3rd year was difficult too, but this is a whole new level. I also decided to switch careers; my original plan was to go into particle physics, but now I think I want to do quantum information. There's a lot more math in that field, and I very recently realised that I enjoy doing math much more than I enjoy doing physics. I think some of the recent posts this year have also reflected that, with more math-y posts this year like #link("/posts/random-numbers")[Random Numbers], #link("/posts/po-shen-loh")[Po-Shen Loh Quadratic Method] and #link("/notes/floats")[Floats].

Maybe my university experience caused that change, maybe that was already the case even before I started, I don't know. I just know that what I was doing before wasn't working for me, and I needed to make this change, so let's see if it pays off.

A lot more stuff has happened too, this year has been a bit of a mental and emotional rollercoaster, but it's not really something I'd like to share on here, so I'll just leave it at that.

= The future

I don't really have any particular plans for 2026, it's more of just continuing and finishing current projects, and doing more of what I'm doing now. That said, I do have some things that I'd like to explore:

- I still want to try out newer languages like #link("https://gleam.run")[Gleam] and #link("https://ziglang.org")[Zig]. I tried using Zig for a bit this year, but there's just something about the language that hasn't clicked in my brain yet, and I'd really like to get it to work. As for Gleam, I don't think I've really given it a fair shot yet, but looking at the few code examples and stuff that I have, I think might like it.
- I want to do more math. Much more than I'm currently doing, and possibly enough to maybe make up for my lack of background in pure math in university. I've done physics, but there's a lot of concepts in math that we don't cover in a physics degree, so I'd like to catch up on as much of that as I can. It would also be nice to write everything up that I've learned and publish it on the internet, and while this blog sounds like the perfect place for that, I'm kind of tempted to give it its own home.
- Kind of related to both of the above points, I really want to learn and get good at #link("https://lean-lang.org/")[Lean]. Being able to write and understand formal proofs in a functional programming language sounds incredibly useful for a lot of things. While imperative programming is closer to how computers actually work, functional programming is closer to the mathematical theory behind it all, and it's very important to me that I understand both well, because I think they'll both be important in my future.
- I want to finish making #link("https://nclang.org/")[NC] so that I can actually use it for my various different projects. I don't know if/when it'll be complete, it might take longer than a year, but there's not much I can do other than just letting things happen how they happen.

= Conclusion

I think that last sentence kind of sums up how I want 2026 to go. Like I said, this year was kind of a rollercoaster, and I'm sure next year will be too. I'm not going to be able to predict every outcome, or prepare for every good/bad thing that happens next year. Rather than be upset by that fact, or try and control every little facet of my life, I think I'd like to try just letting things happen how they happen, and deal with stuff as it comes up. Maybe I'll be happier and more successful in achieving my goals that way, maybe I won't.

No one can predict the future, all we can do is our best, and that's all anyone can ask for, right? That's all I've got for now, happy holidays, and I'll seeya next year!
