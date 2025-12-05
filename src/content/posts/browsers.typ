#import "../../pages/post.typ": *

#metadata((
  title: [Battle of the Browsers],
  date: datetime(year: 2024, month: 1, day: 22),
))
#show: post

I've heard from many people that I should be using some browser because "Browser X is the best" or "Browser X is better than your browser". Most of the time, these people don't really have a very clear reason for _why_ it's the best, just that it is. Now, I'm not really against people having opinions on what they think is the best, and defending their choices and preferences, but it's also important to recognise that others also have their own preferences, and to not try to force or shame them into doing something they don't want to do.

As for why you should listen to me, I'd say I'm a fairly techy person, and I've done enough web development to know a little bit about how browsers work, at least on the level that you and I interact with them at. I'll only talk about the browsers that I've used (which is at least a few), and the feature sets that they have that I've seen.

= Browser engines

Like a car has an engine, browsers have browser engines. These basically dictate how the browser works, and browsers with similar/the same engine will often behave very similarly, at least under the hood. The developer can add additional features on top, of course, and those can range from small, nice-to-have features, to changing the entire user experience of the browser.

As of the writing of this post, there are 3 major browser engines: Blink, Gecko and WebKit. The reason I'm talking about these first instead of the browsers themselves is that they make it a lot easier to categorise the browsers by their engines, and because a lot of the features are shared between browsers of the same engine, I don't have to repeat myself for each browser.

Basically, it makes both understanding and writing easier.

= Blink

This is the browser engine that powers the Chromium browser. Chromium, as you probably guessed from the name, is the browser that powers Chrome. Unlike what people online would have you believe, Chromium is actually #link("https://chromium.googlesource.com")[open source], and there's a lot of other browsers that are built on top of it, like Brave, Edge, Opera (including Opera GX), Vivaldi, Samsung Internet, and so many more.

Blink was actually #link("https://groups.google.com/a/chromium.org/g/blink-dev/c/J41PSKuMan0/m/gD5xcqicqP8J")[forked] from #link("#webkit")[WebKit] in 2013. However, it is so far from WebKit now that it wouldn't be fair to compare the two engines. It's by far the most popular browser engine in the world, with #link("https://gs.statcounter.com/browser-market-share")[over 74%] of the international browser market share, the majority of which comes from Chrome.

== Chrome

The Chrome browser is the most popular browser in the world, with around #link("https://www.statista.com/statistics/268254/market-share-of-internet-browsers-worldwide-since-2009/")[60-65%] of the browser market share alone. It's the default browser on Android and ChromeOS, but many people prefer using it over the defaults on desktop platforms like Windows and macOS too.

Chrome first launched in 2008 for Windows XP, and released previews and betas for macOS and Linux as early as 2009. At the time, it was a much faster browser than the alternatives, largely due to its highly performant V8 JavaScript engine. In fact, many web development tools like Node.js and Deno still use V8 for its incredible performance and capability.

This initial benefit, in addition to the popularity of Google search and other Google services like Gmail, are likely what led to the rise in browser usage for Chrome, especially among the general audience. To this day, Chrome's integration with Google services is unmatched. If you use a lot of Google's suite of products, you're unlikely to find a better experience than Chrome.

#quote(
  title: [OPINION],
)[
  I've used Chrome for a lot of my life, and I like Google's projects in general. The Chrome browser, and Chromium in general, has a lot of benefits, even technically speaking. I've written about some of these in my #link("./google#chromium")[Google: A Misrepresented Evil] post, but more than that, they've given the world a lot of very helpful and important tools, like Node.js.

  However, I don't really like using Chrome on my computer anymore. It feels somehow slower and clunkier than other browsers, and installs a bunch of other things I don't want. I wish all they had was a `Chrome.app` that I could click on and run, without registering a couple background processes along the way. I also wish that signing into one Google service wouldn't sign me in to the whole browser, and also every other Google service. In fact, I don't really like signing into browsers at all (with an exception).

  At the same time, though, I do recognise that a majority of people use Chrome, and generally enjoy it, and I'd be lying if I said I didn't think it was a good browser.
]

== Edge

Microsoft Edge is the third most popular browser in the world. Although it's built on Chromium, the user experience of the browser feels a lot more centered around Microsoft. This is immediately visible with the design of the browser, and all of the Microsoft-specific features built into it, like Bing Chat.

Edge also brings with it a lot of features that other Chromium browsers don't have, like Enhanced Security Mode, which enables security mitigations and disables Just-In-Time (JIT) compilation. The Microsoft Browser Vulnerability Research team has a whole #link("https://microsoftedge.github.io/edgevr/posts/Super-Duper-Secure-Mode/")[post] about this, which I encourage you to check out if you're interested.

In addition to this, Edge also ties in really well to Microsoft's services, and in general performs a lot better on Windows than most other browsers. However, as the browser has a lot of features built-in, a lot of people simply pass it up #link("https://www.thurrott.com/cloud/web-browsers/microsoft-edge/259781/users-pushback-against-bloatware-in-microsoft-edge")[as] #link("https://www.techradar.com/computing/edge/microsoft-edge-is-installing-bloat-without-asking-and-we-cant-work-out-why")[being] #link("https://answers.microsoft.com/en-us/microsoftedge/forum/all/why-is-edge-being-bloated-and-slowed-down/da3a2ee9-9a11-4b6e-b638-0b1d1bf82a6e")["too] #link("https://www.reddit.com/r/browsers/comments/14s6kmg/wtf_happen_to_microsoft_edge_its_so_bloated_and/")[bloated"].

#quote(
  title: [OPINION],
)[
  Personally, I'm not quite sure how I feel about Edge. There are times where I've liked using it, and other times where it really annoyed me.

  Bloat is a real issue with Edge, especially nowadays with features like Bing Chat/Microsoft Copilot, and the sidebar, as well as the Wallet, etc. The list of "features" is far too long for me to remember, and I usually just went into settings and turned it all off anyway. For someone who's that deep into the Microsoft ecosystem and uses the features, I'm sure it's a great thing, but it's not for me.

  Another thing that annoys me is that if you disable storing cookies on exit, the start page for the browser shows you a cookie banner each time you start it. Why their start page was storing any cookies in the first place, especially after I disabled all of the features of the start page, is beyond me. Every other browser that I've tried has figured this out, so I'm not sure what Edge is doing. At least they ask, I suppose.

  However, once you configure Edge to be how you want it, it's not a terrible browser. It's more optimised for Windows than Chrome is, and properly ties in with system features like Defender. If I had the ability to customise the browser how I want it, I'd generally pick Edge over Chrome on Windows.
]

== Brave

Brave is an #link("https://github.com/brave/brave-browser")[open source] browser whose main focus is user privacy. They build upon the Chromium browser and replaces Google's services with their own. They have an entire ecosystem of services, from Brave accounts, Brave Talk and Brave Search, to their Leo AI, Brave Firewall + VPN, and even their own cryptocurrency called BAT, along with an associated Brave Wallet.

The browser comes with an adblocker built-in called Brave Shields, which is built into the core of the browser. Although this isn't representative of an actual privacy gain, it's worth noting that Brave scores the highest on #link("https://privacytests.org")[PrivacyTests.org], and is recommended by privacy-focused organisations like #link("https://www.privacyguides.org/en/tools/#desktop-web-browsers")[Privacy Guides] and #link("https://thenewoil.org/en/guides/most-important/browser/")[The New Oil].

It's generally marketed as a privacy-focused browser, although their Brave Ads business has led them to be compared to Google with Google Ads. In addition, just like Edge, a lot of their features have been labelled as #link("https://community.brave.com/t/brave-is-getting-heavier-bloated-buggy-every-new-update/482229")["bloat"]. There was also a case where Brave was found #link("https://stackdiary.com/brave-selling-copyrighted-data-for-ai-training/")["selling copyrighted data for AI training"], although it was data from Brave Search and not the browser itself.

#quote(
  title: [OPINION],
)[
  I like Brave. Like with Edge, the initial setup is a little annoying to do (not nearly as bad as Edge, though), but after that it's smooth sailing. I'm not cryptocurrency person, and so I don't really care for BAT or the Wallet, and I'm glad it gives you the option to turn it off.

  Brave Search has also worked well for me in the past, though I do still use Google search. Google isn't as good as it used to be, but I've found it better than the alternatives. The "least bad" option, if you will.

  However, there have been many controveries behind #link("https://archive.is/Tu0M2#Controversies")[Brave] and its #link("https://www.wired.com/2014/04/brendan-eichs-downfall/")[founder], and if you'd like to read a more criticising view of Brave, I can recommend #link("https://www.zdnet.com/article/brave-browser-the-bad-and-the-ugly/")[this ZDNet article].

  While a lot of their controversies don't really affect the browser itself, I know people who refuse to use Brave simply because of Brendan Eich and so I figured I'd mention it.
]

= Gecko

Gecko is a browser engine developed by Mozilla with the aim of being as compliant with the open web standards as possible, and is used in their products like Firefox and Thunderbird. It's also the oldest browser engine in this list, being first created at Netscape (essentially the predecessors to Mozilla) in 1997, as well as the only one to not be developed by a Big Tech company.

However, that doesn't mean that it's fallen behind in any way. Gecko is one of the faster browser engines, with people reporting that Firefox runs #link("https://news.ycombinator.com/item?id=36770883")[even faster than Chrome] does. Mozilla has been further improving the security and performance of the browser engine, with projects like #link("https://wiki.mozilla.org/Quantum")[Quantum].

== Firefox

Firefox is really the main browser built on top of Gecko, with most others like Librewolf or Waterfox simply being forks of Firefox instead of being built on top of Gecko. Firefox is a pretty old browser, having been around since 2002 as "Phoenix" before changing its name in 2004. In its early days, it was a #link("https://gs.statcounter.com/browser-market-share/desktop/worldwide/#monthly-200901-201301")[serious competitor] to Internet Explorer, until Chrome launched and took over the whole market.

Today, it's a formidable browser that sits as the fourth-most used in the world.

#quote(
  title: [OPINION],
)[
  I like Firefox as a browser. It's relatively clean, fast, and usually works, and takes me a lot less work to set up than Brave, Chrome or Edge do. However, it's not as great as Chromium to do web development in since a lot of the browser DevTools simply aren't as well-made as Chromium's or WebKit's. I also have a problem with Mozilla, which I've written about in a #link("/notes/mozilla")[Note].
]

= WebKit

WebKit is Apple's browser engine that's used primarily in Safari. Just like the other engines, WebKit is #link("https://github.com/WebKit/WebKit")[open source], and different versions of it have been used in other browsers, like WebKitGTK in GNOME Web, as well as many of Apple's own applications, including the #link("https://webkit.org")[Apple Mail client and the App Store]. WebKit was also used by Google Chrome and Opera, before they #link("https://www.chromium.org/blink/developer-faq/")[switched to the Blink engine].

== Safari

Safari is Apple's proprietary browser that's built on top of WebKit. It's heavily optimised for Apple's operating systems and is generally the most performant browser for those systems. Safari is the #link("https://gs.statcounter.com/browser-market-share")[2nd most used browser in the world], with around 18% market share.

#quote(
  title: [OPINION],
)[
  Safari has been a great browser in the few months that I've been using it. I've had people tell me to switch to other browsers like Chrome, but I haven't really had a reason to so far. It's really fast, battery-efficient and ties in really well with Apple's other services like Private Relay and Keychain. Safari's extension support is a bit lacking, but since all I use is an adblocker and Bitwarden, I'm fine with that.

  From a web development perspective, Safari doesn't have _all_ of the features that Chrome does, and despite being the #link("https://wpt.fyi/interop-2023?stable")[2nd most standards-compliant] browser, it still lacks a lot of the cool new tech like the View Transitions API. That being said, I haven't really experienced too many issues with it.
]

= The differences

The major differences between the browsers are their user interfaces (UIs), the user experience (UX), and the developer experience (DX).

#note[
  When I say "developer experience", I mean from the perspective of a web developer. I have not worked on a browser myself and do not have a clue what that experience is like. I suppose web developers are technically users of browsers, but the experience is different enough that I think it's worth putting them in a separate category.
]

== User interface (UI)

Most browsers have a relatively similar UI: tabs at the top, extensions on the top right, bookmarks in a bar below tabs, etc. Each browser has its own spin on this design, with different colors, shapes, sizes, etc., but it's fairly intuitive to switch from one browser to another because of this consistency. That being said, some browsers allow for far more customisation than others, like Vivaldi or Firefox allowing their users to completely redesign their browser using CSS, or Chrome allowing users to make and share color themes, or Safari being completely unthemeable outside of the OS-provided color schemes.

People will generally adapt to different UIs fairly quickly, and so this isn't a major difference between them, although for those who enjoy customisation, more locked-down browsers like Chrome and Safari might not be good options.

== User experience (UX)

This is the major difference that most people will experience when using different browsers. Although their UIs may be similar, the experience of using them could be completely different. For instance, Chrome is heavily integrated with Google, so someone who uses a lot of Google services would likely benefit from using Chrome. The situation for other popular browsers is similar, such as Edge with Microsoft or Safari with Apple. This can include services like password managers, which are usually built into the browser and linked to your account.

There are also other things that constitute the user experience, such as extension support. Chromium browsers have access to the Chrome Web Store, and Firefox-based browser have access to Firefox extensions, both of which are in the tens or hundreds of thousands. Meanwhile, the extension support on Safari is far more limited, and many are paid which limits their availability to users even further. For someone who uses a lot of extensions, or requires some specific extensions for their browsing, this may be the main deciding factor in their choice.

One of the main reasons that people choose a specific browser is because of website compatibility. Although this issue is declining with every browser update that brings it closer to web standards, there are still websites that will either not work properly or simply refuse to load on certain browsers, generally due to the website using features the browser may lack. However, this problem will likely disappear in the near future as browser vendors aim for full compatibility.

== Developer experience (DX)

Much of the developer experience in different browsers boils down to compatibilty and the built-in developer tools.

Compatibility is a huge problem for web developers, as they need to ensure that their code and designs have the exact same behavior on all of the browsers their visitors are likely to use. Not doing so would mean risking losing customers, and no business wants that. Generally developers will support the most used versions of the most used browsers, to maximise compatibility, and that is becoming easier to do as browsers gain feature parity with one another.

#quote(
  title: [OPINION],
)[
  A lot of people put the responsibility of supporting different browsers on the developers of the website, but I don't think that's fair. Trying to convert an API or feature from a supporting browser to an unsupporting one can be incredibly difficult, and will generally result in a worse experience for the user. It's also expensive for the business to hire developers to code and maintain those features until the browser adds them natively, which can be an issue for smaller businesses.

  I'm not saying people are wrong to complain about something they expect to work, not working. I think the solution is for both web developers and browsers to simply follow the web standards. That will result in better compatibility, accessibility and sustainability, since most of the web is completely backwards-compatible. Since all of the popular browsers are backed by multi-billion- and trillion-dollar companies, I'm not quite sure why this has taken so long, but I'm glad we're finally starting to take it seriously.
]

The built-in developer tools can also make or break a web developer's experience. For instance, Chrome's DevTools are very powerful, with features like Lighthouse and Device Mode built in to them. Safari and Firefox don't have the same set of features, and depending on your development style and audience, you may need these features. Lighthouse can be helpful for locally testing your website for performance and accessibility, and is only available in Chromium-based browsers, for example. Generally, the best method is to either manually test on all of the browsers your visitors are likely to use, or to use a testing framework to do that for you.

= Other browser engines

Other than the 3 browser engines above, others also exist:

- #link("https://servo.org")[Servo], a browser engine written in Rust with performance and web standards in mind. It was born out of Mozilla, but has since moved to Linux Foundation Europe.
- #link("https://ladybird.dev")[Ladybird], a browser written from scratch for SerenityOS.
- #link("https://www.palemoon.org/tech/goanna.shtml")[Goanna], a fork of an old version of #link("#gecko")[Gecko] that is used in the Pale Moon browser. Updates to the Gecko engine have added security updates, which may have not been added to Goanna. Goanna and Pale Moon therefore may be insecure, and are not recommended to be used.

There are likely many others that I missed, as these are the only ones I've heard of. Making a browser engine is a lot of work, which is probably why it's mostly big companies that have been able to succeed so far.

= A peace treaty

Ask yourself the question, "Why do I use the browser that I do?". If you can easily answer that, then I'm sure you can understand that others may have their own reasons for using their browsers of choice. If you can't, then maybe you simply haven't found the right browser for you yet.

At the end of the day, everyone uses whatever browser they want to, and I don't fully understand why people get so tribal about it. I've seen arguments online about why Firefox is better than Chrome, and I've had people tell me that Safari sucks, without being able to really explain why. In fact, that was one of the main reasons for me writing this post in the first place! I probably missed out on a lot of points, but I hope I've been able to cover some of the major differences between the different browsers, and maybe highlight that they're not so different after all.

So maybe next time before you tell someone their browser sucks, you can try to understand why they may be using what they use, present the case for your preferred browser, and let them choose for themselves.
