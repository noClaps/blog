#import "../../pages/post.typ": *

#metadata((
  title: [Threat Modelling],
  date: datetime(year: 2023, month: 1, day: 18),
))
#show: post

Before you start on your privacy and security journey, one of the main things you should figure out is your threat model.

= What is this threat model thing?

Your threat model is pretty much a plan for what you're protecting and who you're protecting it from. Using that, the tools and services may you choose to use are much easier to decide, especially considering the #link("https://distrowatch.com/dwres.php?resource=family-tree")[insanely large number] of options for some things.

#quote(
  title: [Threat Modelling, Victoria Drake, OWASP Foundation],
  href: "https://owasp.org/www-community/Threat_Modeling",
)[
  Threat modeling works to identify, communicate, and understand threats and mitigations within the context of protecting something of value.

  A threat model is a structured representation of all the information that affects the security of an application. In essence, it is a view of the application and its environment through the lens of security.
]

That's all fancy talk for "identify who you don't want to get your stuff, so that you can work toward not letting them get your stuff". Everyone's threat model is different, so when you say "I don't care about privacy", that doesn't mean you don't care about your privacy. It just means you have a different threat model than someone else, and you don't want to change that. And that's fine, everyone has their own level of comfort with the data they share.

For instance, someone's threat model could be to protect against tracking and data collection, but not necessarily need to block out Big Tech companies or the government. Someone else's threat model may require them to be #link("https://www.ohchr.org/en/stories/2015/06/human-rights-encryption-and-anonymity-digital-age")[anonymous], even if it may come at the cost of their unidentifiable data leaking, such as #link("https://en.wikipedia.org/wiki/Whistleblower#Risks")[whistleblowers] or #link("https://www.theguardian.com/global-development/2022/mar/02/more-human-rights-defenders-murdered-2021-environmental-indigenous-rights-activists")[activists]. Those two individuals would be using very different tools to achieve their goals, some of which are not interchangeable. Having a clear threat model helps realise what those goals are, and what tools to use to achieve them.

= Why should I get one of those?

Consider how many browsers are out there: Brave, Firefox, Chrome, Edge, Opera, Vivaldi. Each of those browser serves a different purpose, and it can be hard to choose. However, if you know you're deep into the Google ecosystem, you wouldn't really go and pick Firefox or Opera, you'd pick Chrome. From a convenience perspective, it's the easiest one for you to just install and start using, and so it's the best browser for you. Someone else may not agree, and that's how a lot of internet disputes start.

Do you see how having a plan or idea of what you needed helped you make the decision? A threat model does exactly that, it helps you pick and choose the tools and services you use.

Let's look at an example. Let's say you're someone who needs a lot of security, but not necessarily too much privacy or anonymity. It's okay if your data is used by the service to sell ads, as long as it doesn't get leaked or hacked to the public. Those working in areas like government research programs or big companies have a threat model like this. For a threat model like this:

- The best OS for you would be Android with Google's #link("https://landing.google.com/advancedprotection/")[Advanced Protection Program], #link("https://grapheneos.org/")[GrapheneOS], or iOS with #link("https://support.apple.com/en-us/HT202303#advanced")[Advanced Data Protection]. If a desktop is necessary, then #link("https://www.chromium.org/chromium-os/chromiumos-design-docs/security-overview/")[ChromeOS] (which has a similar security model to #link("https://source.android.com/docs/security")[Android]) or #link("https://support.apple.com/en-gb/guide/security/welcome/web")[macOS] would be far better than Windows or #link("https://privsec.dev/posts/linux/linux-insecurities/")[Linux distributions]. Ideally, just a phone would be enough.

- Unless you're on iOS, where all #link("https://developer.apple.com/app-store/review/guidelines/#software-requirements")[browsers are just Safari], the most secure browser is #link("https://www.chromium.org/Home/chromium-security/")[Chromium/Chrome], not #link("https://madaidans-insecurities.github.io/firefox-chromium.html")[Firefox], contrary to what many in the privacy community may have you believe.

- Apart from that, the best advice would be to have as few trusted parties as possible. Meaning if you're using Google stuff (Android and Chrome) then don't go and use Dropbox and unnecessarily trust a third party, since that's an additional point that you could get hacked from. In general, you'd want to minimise the number of services you use, to have as few points of attack as possible.

#warning[
  This is not actual security advice, it is just an example. Please do not listen to this if you are in a situation as described above. I do not take responsibility for any trouble you may get in because of my example explaining threat modelling. I am just a person on the internet and do not give out actual security advice.
]

Now compare that to someone who maybe wants to protect their data from being used by Big Tech companies to sell ads and track them across the internet. They'd have a threat model that calls for higher privacy at the cost of some minimal security. For someone like that:

- Linux distributions may be a good option for a desktop OS, with their lack of tracking built-in to the system and generally open nature. An OS like GrapheneOS or iOS may be sufficient, without the Advanced Data Protection or Advanced Protection Program, or perhaps even without an Apple or Google account entirely.

- Browsers like Brave or Firefox (hardened with #link("https://github.com/arkenfox/user.js/")[Arkenfox]) would be much better options with their tracking protection and adblocking (built-in on Brave, with an extension like #link("https://github.com/gorhill/uBlock")[uBlock Origin] for Firefox) features.

- Instead of having fewer trusted parties, the advice would be to put as few eggs in one basket as possible. So in a situation like this, using #link("https://ente.io")[Ente] for photos, #link("https://proton.me/drive")[Proton Drive] for cloud storage, and #link("https://tutanota.com/")[Tutanota] for email would be beneficial, so one company doesn't hold _all_ of your data.

Someone who wishes to stay anonymous would have a different set of tools, like #link("https://www.torproject.org/")[Tor Browser] and #link("https://www.whonix.org/")[Whonix] or #link("https://tails.boum.org/")[Tails].

As you can see, having a threat model helps make the decisions on how to go about picking the tools and services, depending on what you're protecting and who you're protecting against.

= Want threat model. How get?

There's many guides and tools out there to help you create a threat model, but in general it boils down to 5 questions:

#quote(
  title: [Threat Modelling, Privacy Guides],
  href: "https://www.privacyguides.org/basics/threat-modeling/",
)[
  1. What do I want to protect?

  2. Who do I want to protect it from?

  3. How likely is it that I will need to protect it?

  4. How bad are the consequences if I fail?

  5. How much trouble am I willing to go through to try to prevent potential consequences?
]

I encourage you to read the whole threat modelling guide from Privacy Guides, it's very well written and clearly explains each step.

== What do I want to protect?

For most people, this is their data. This usually includes stuff like emails, conversations, browsing activity, device usage, etc. However, it varies between threat models. For instance, someone who requires anonymity may want to protect their identity, even if their browsing activity is far more easily available.

== Who do I want to protect it from?

This is the "threat" part of threat modelling. Who do you consider a threat against the thing you're protecting? In the case of most people, this is companies that use their data to track them across the internet, usually to show them ads.

If your threat is your government, you're in a lot of trouble if you're reading this blog post. See above warning about not taking advice from person on internet.

== How likely is it that I will need to protect it?

This is one of those questions that could drastically change from one person to another. In the case of the majority of people, they don't necessarily _need_ to protect their data, but they certainly _want_ to. However, in the case of someone in a more sensitive situation, they may _need_ to protect their data or identity, or else they could be in grave danger or lose their life.

== How bad are the consequences if I fail?

The answer to this question tends to stem from the previous one. If you're not in a very sensitive situation and you just don't want to be tracked across the web, the worst that could really happen is some ad company, like Google or Meta, end up getting a small amount of data about you and are able to track you, at least for as long as you have the flaw in your system.

However, there are situations where failure to identify your threats or use proper tools could risk in sensitive information getting leaked, or someone losing their life.

== How much trouble am I willing to go through to try to prevent potential consequences?

This is usually the part where most people give up and go back to their original setup, while continuing to complain about a lack of privacy on said setup. This is also the part that _really_ specifies the tools that you'd end up using, usually narrowing it down to one or two options.

#note[
  Keep in mind that most of the extreme situations mentioned above, such as the ones where high security or anonymity are required, probably don't apply to you. The people that those apply to probably aren't reading this blog, since they have many other things to be worrying about.

  One of the common mistakes I've seen people do is not properly identify their threat model, try to go all in on privacy, security or anonymity, find it too complicated, and go back to their original setup, and continue to complain about how privacy-invasive or insecure their setup is. That's mainly why a threat model is helpful and necessary, so you can identify exactly what you're trying to achieve.
]

= What comes next?

Now that you have your threat model in place, start looking for tools that you think fit it well. One of the places I recommend you start is a password manager. It's something that makes your life easier, while also making it more private and secure (#link("https://blog.lastpass.com/2022/12/notice-of-recent-security-incident/")[most of the time]). Some good password managers I can recommend are KeePass, #link("https://bitwarden.com/")[Bitwarden], #link("https://1password.com/")[1Password], #link("https://www.passwordstore.org/")[pass], and #link("https://support.apple.com/en-gb/HT204085")[iCloud Keychain]. They can generate strong passwords and store them for you, which means no more forgetting passwords to your accounts. Some also offer the ability to store 2FA keys, and while storing 2FA keys in your password manager has its #link("https://passwordbits.com/2fa-inside-password-manager/")[own pros and cons], the feature is there if you want it. You can decide your own steps after that.

Keep in mind that when you're making changes, you will have to research for yourself the options available to you, to see which one fits you the best. This may take time and lots of trial-and-error, so don't be afraid to try things out. Free trials and plans will likely be your best friend throughout this (though please do consider donating/subscribing to the projects if you like them! More often than not, these projects don't get a lot of funding!). You can use an email aliasing service like #link("https://simplelogin.io/")[SimpleLogin] or #link("https://anonaddy.com/")[AnonAddy] if you don't want to give out your real email when signing up for services.

If you have a spare computer or phone you can use that, if you're concerned with letting it touch your current data or setup. If not, most mainstream OSes have strong enough sandboxing of profiles that you could set up a new one and use that without fear of it touching your other setup. Virtual machines achieve a similar goal, though may be a little harder to set up.

Sometimes this can be difficult or time-consuming, so feel free to take all the time you need. Your threat model may change along the way, and that's perfectly fine! Remember, privacy is a journey, but it's only as long as you're willing to make it.

= Additional Sources

#link("https://privacyguides.org")[Privacy Guides] - They have some great suggestions for privacy-friendly tools, and the site is constantly updated with the newest information. Good starting point for exploring options for tools and services.

#link("https://privsec.dev")[PrivSec.dev] - They have some great explanations for a variety of different topics related to privacy and security. Some of the articles can get a bit technical, but most of them are very clearly explained and easy to understand.
