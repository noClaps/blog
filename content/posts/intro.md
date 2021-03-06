---
title: Intro
description: How to protect yourself from the internet, on the internet
date: 2022-04-06
lastmod: 2022-07-05
url: /tech/psa/intro/
tags: ['tech', 'privacy/security/anonymity']
---

---
I've really gotten into this stuff over the last year or so. I probably shouldn't have, since I had a lot of (arguably) more important stuff going on during that time, and focusing on that might have been better for me and my future. But I digress.

A lot of the stuff I say here might end up sounding like I live in the woods with a tinfoil hat, but I promise you at least 90% of the things I say here are true as of posting this. I also want to make sure you know, a lot of the stuff mentioned here will probably change someday, whereas this post will probably not be updated often, if at all. So be sure that the information you're getting is up to date. I'll link a few good sources of information at the bottom that can help you stay up-to-date on your privacy and security knowledge.

If you have any updates or changes you'd like to suggest, you can open an issue on the [Git repo for this blog](https://github.com/noClaps/blog).

## Why should I care?
The online world is both a wonderful and terrible place. On one hand, you have [more information available in the blink of an eye](https://www.livescience.com/54094-how-big-is-the-internet.html) than any library or school would ever be able to provide. You have a way to connect with people instantaneously through mediums like instant messaging or e-mail, discuss topics with thousands or millions of people at once on online forums and communities. You can display your talents to an audience so large it's mind-boggling. There are many, many improvements to everyday life that the internet has brought with it. It's never been easier to be completely free and uncensored.

As with everything, where there is a positive, there's a negative to rival it. There are constantly people and companies trying to take control of you and your behavior for their own benefit. Companies like Google, Facebook, Microsoft, Amazon, etc., all make [millions and millions of dollars](https://www.visualcapitalist.com/how-big-tech-makes-their-billions-2020/) every year just from your personal information. And you don't get a penny of that back. Not only that, these companies have immense political power, mainly through [lobbying](https://www.cnbc.com/2020/01/22/how-much-google-facebook-amazon-and-apple-spent-on-lobbying-in-2019.html) and collaborations with the US government in surveillance programs like [PRISM](https://en.wikipedia.org/wiki/PRISM_(surveillance_program)).

Along with that, there's manipulation for things [as big as US presidential elections](https://en.wikipedia.org/wiki/Facebook%E2%80%93Cambridge_Analytica_data_scandal), and danger for [activists](https://en.wikipedia.org/wiki/School_Strike_for_Climate#Censorship), [whistleblowers](https://en.wikipedia.org/wiki/Whistleblower#Risks), [privacy-friendly services](https://en.wikipedia.org/wiki/Lavabit#Suspension_and_gag_order), and more. While your situation may not be as extreme as these, it's always good to have control over your decisions, your information, and most importantly, your life.

This is especially true when [Gmail scans all of your emails](https://www.theguardian.com/technology/2014/apr/15/gmail-scans-all-emails-new-google-terms-clarify), [Facebook tracks you and sells your data](https://joindeleteme.com/blog/does-facebook-sell-your-data/), [Microsoft looks at pretty much everything you do on Windows](https://bgr.com/general/windows-10-upgrade-spying-how-to-opt-out/), [your Nest or Echo can hear almost everything you say at home](https://www.consumerwatchdog.org/privacy-technology/how-google-and-amazon-are-spying-you), and [so](https://www.eff.org/deeplinks/2018/05/its-time-payment-processors-stripe-and-paypal-start-publishing-transparency), [so](https://nakedsecurity.sophos.com/2012/08/09/creepy-quora-erodes-users-privacy-reveals-what-you-have-read/) [many](https://reddit.zendesk.com/hc/en-us/articles/360043048412-What-information-does-Reddit-collect-about-me-and-my-account-) [more](https://www.usatoday.com/story/tech/news/2018/07/20/what-you-do-spotify-public-and-can-used-against-you/801647002/) [privacy](https://news.sky.com/story/netflix-accused-of-spying-on-users-after-creepy-tweet-11167513) [violations](https://www.opensocietyfoundations.org/voices/amazon-is-waging-a-war-on-privacy).

Don't expect the government to come and save you either. The unfortunate part of all of this is that laws aren't able to catch up with the rapid development of the internet. In many cases, it's hindered by power-hungry politicians or greedy companies lobbying and manipulating said power-hungry politicians, making a never-ending loop of power and corruption. That leaves people like you and I in a state of helplessness, constantly being controlled and profited on, without getting any returns out of it.

I hope this explains why you should care about your own privacy. It's because **no one else does**.

## PSA - Privacy, Security and Anonymity
People often confuse these 3 terms, and while they can be interchangeable in a few situations, they are very different things and should be treated as such.

- [**Privacy**](https://en.wikipedia.org/wiki/Privacy) is when you have control over your personal information and who can see it.
- [**Security**](https://en.wikipedia.org/wiki/Computer_security) is when you have protection from unauthorized malicious actors.
- [**Anonymity**](https://en.wikipedia.org/wiki/Anonymity) is when you have a completely unknown/untraceable identity.

It's possible to have one but not the others, and depending on what you're looking for, the tools you use will differ. For instance, [Tor](https://www.torproject.org/) is a much better tool for **anonymity**, whereas it's not as good as [Chromium](https://www.chromium.org/Home/) for **security**, which is not as good as [Firefox](https://www.mozilla.org/en-US/firefox/new/) for **privacy**.

There aren't many tools that'll give you privacy, security as well as anonymity, so make sure you know the difference between these 3 concepts, because it will really help you choose the right tools and services for the job. Also, whatever you choose, make sure it actually works for you, and you aren't just picking it because some nerd on the internet told you to. A lot of the time, people get frustrated with trying to achieve privacy because the things that internet strangers "force" them to use doesn't work for them, and they give up entirely.

In follow-up posts to this, I'll suggest some of the tools and services I've heard of / used before, and how good or bad they are (according to me) for privacy and/or security. You don't have to listen to anything I say, and I encourage you to do your own research before making a decision. Try out different tools and services and see what works for you, before making a firm decision to use one.

## Open source everything
Throughout my various posts on this topic, you may hear the term "open source" a lot. Other variations of this you may hear online are OSS (Open Source Software), FOSS (Free and Open Source Software) or FLOSS (Free/Libre and Open Source). They have some [slight differences](https://www.gnu.org/philosophy/floss-and-foss.en.html) in their definitions, but for the most part they can be interchangeable.

Open source basically means you can see the source code of the app, program, service, etc., that you're using. An example of this is this blog, the Blog of Random. You can find the source HTML, CSS, etc., for this blog at my [GitHub](https://github.com/noClaps/blog), linked up at the top. Another famous example of open source software is the [Firefox](https://firefox-source-docs.mozilla.org/contributing/directory_structure.html) [browser](https://searchfox.org/mozilla-central/source).

Most of the apps and services I suggest will be mostly or fully open source, at least for the parts that actually matter. This is because open source is easier to "trust", since any [malicious behavior can be relatively easily spotted](https://appleinsider.com/articles/21/07/04/open-source-audacity-deemed-spyware-over-data-collection-changes). I put "trust" in quotes because that's kind of the opposite of what we want. The purpose of open source software is to remove the need for trust entirely, because everything is clearly visible. Theoretically, anyone can go through the code, find something they don't like, and remove it in their fork (version) of the app. Practically, this isn't always possible because not everyone can understand code or audit effectively. Even in cases like this, having the source code be available helps transparency on the developer's end, making them just a little easier to trust.

Open source software can also have better privacy and security due to a theory called [Linus's law](https://en.wikipedia.org/wiki/Linus%27s_law). It states that open source software has many eyes on it, so bugs, vulnerabilities, or trackers are much easier to catch. It's important that I mention that this isn't always true, and there are many cases in which [closed source software is more secure than open source](https://madaidans-insecurities.github.io/firefox-chromium.html). The best way to ensure security, other than verifying it yourself by going through the source code, is to make sure the services you're using have been audited recently and have fixed any security vulnerabilities that have been found.

## Encryption
This is one of those big fancy "security professional" words that most people tell themselves they understand to look smart in front of their friends. And that's exactly what I'm gonna do too, because I am by no means a security professional.

Encryption is important. It's what protects your stuff from being openly available to anyone on the internet. But not all encryption is equal, some kinds of encryption are better than others for certain purposes.

### Why is encryption important?
Imagine you're talking to your friend about something sensitive and personal to you. The only reason you're talking to them about it is because you trust them. Now imagine what it would feel like if someone was hiding, listening to your whole conversation, and then proceeded to tell everyone about this very personal thing that you didn't want anyone to know.

Having encryption is the equivalent of having a secret language that you and your friend made up and speak in. Whether that's something as simple as a [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher), or something as complex as [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy), it's all a kind of encryption. Of course, PGP is a much stronger encryption protocol than a Caesar cipher, and there are better encryption protocols out there made specifically different things.

Many people will try to convince you that encryption is bad, and that you don't need encryption if you have [nothing to hide](https://en.wikipedia.org/wiki/Nothing_to_hide_argument). They'll make arguments like "Removing encryption can help us catch criminals, like terrorists and pedophiles. THINK OF THE COUNTRY! THINK OF THE CHILDREN!", implying that anyone who uses encryption is a criminal that has something to hide. I don't support crime, but removing encryption entirely and spying on everyone seems to me like a "guilty until proven innocent" system. Also, the government wouldn't be the only one who would have access to your data, so would every hacker and bad internet person out there. There have even been cases where [hackers posed as the police to get data from companies](https://krebsonsecurity.com/2022/03/hackers-gaining-power-of-subpoena-via-fake-emergency-data-requests/)!

Then again, these are the same people [running](https://en.wikipedia.org/wiki/Mass_surveillance#By_country) [mass](https://en.wikipedia.org/wiki/PRISM_(surveillance_program)) [surveillance](https://en.wikipedia.org/wiki/Five_Eyes) [programs](https://www.businesstelegraph.co.uk/the-secret-police-cops-built-a-shadowy-surveillance-machine-in-minnesota-after-george-floyds-murder-mit-technology-review/) and hiding them from you, so who's really in the wrong here? ["Nothing to hide" is an illogical argument](https://www.amnesty.org/en/latest/campaigns/2015/04/7-reasons-why-ive-got-nothing-to-hide-is-the-wrong-response-to-mass-surveillance/) because privacy and security are basic human rights, not crimes or luxuries.

### The green lock
You've probably seen the green lock icon in your browser when you visit websites. That green lock tells you that you're using something called [HyperText Transfer Protocol Secure (HTTPS)](https://en.wikipedia.org/wiki/HTTPS). This is a bit complicated, but for the most part, it means that the data you're sending and receiving from the websites you visit is encrypted using a protocol called [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security), formerly known as Secure Sockets Layer (SSL). Here's a [brief explanation of HTTPS, TLS and SSL](https://howhttps.works/https-ssl-tls-differences/).

A lot of big words, I know. Don't worry, it's a pretty complicated topic that, luckily, you don't have to understand. All you need to know is that most of your internet activity is encrypted using this stuff, which is mostly why you're not getting hacked by someone every day. This includes most websites you visit, your instant messengers (excluding SMS), emails, etc. Basically anything you need WiFi or an internet connection to use, it's probably encrypted using HTTPS.

However, some websites don't use HTTPS, and that's when your browser warns you that there's a "security risk ahead" or "your connection is not private" or whatever, and you get a cross on the lock icon in the search/URL bar. This means that the data you send and receive from those websites isn't encrypted, which means that hackers, governments, whoever you're trying to protect yourself from, will be able to see what you do on that website, if they choose to do so. And as shown by the mass surveillance examples above, they will always choose to do so.

### End-to-end encryption (e2ee)
[End-to-end encryption](https://en.wikipedia.org/wiki/End-to-end_encryption) is exactly what it sounds like, your data is encrypted from one end to the other, and no one in the middle is able to access it. It's also called "[zero-knowledge encryption](https://tresorit.com/blog/zero-knowledge-encryption/)" in cases like cloud storage, since the provider has "zero knowledge" about your data.

It's arguably the most private and secure form of encryption, since it removes all trust from the provider. In end-to-end encrypted communication, the messages you send are encrypted on your device, sent to the server in encrypted form so they can't see your messages, and sent to the person you're talking to from there, where the message is then decrypted so that they can read it. In the case of cloud storage, the data is encrypted on your phone and sent to the server, where it's stored in its encrypted form. When you need the data back, the server sends it to you, and then you can decrypt it with your private key (your password, usually).

As you can see, if there is e2ee, there is no need to trust the provider, whether that's the messaging platform, cloud storage provider, etc., that they're not reading your messages. This also highlights the importance of open source, since we can verify in open source apps if the data is actually being encrypted or not, whereas in closed source apps you need to trust the developers that they actually encrypt the data on your device before sending it to the server.

Obviously, e2ee is quite a bit more complicated than that, but that's about the gist of it.

## Metadata
### What is it?
The simplest way to define metadata is "data about data".

Imagine you take a photo of a tree on your phone. The data in this case would be the photo itself: the colors and positions of each pixel in the photo, basically what makes the photo a **photo**. The metadata would be additional information about the photo, like the location you took the photo at, the kind of lens you used, the date and time you took the photo, the ISO and focal length, etc. It's basically data about the photo.

In the context of messaging, the message you send, whether that's text, images, files, videos, audio, whatever, is the data. Everything about the message, like who you're sending it to, when you're sending it, when it's received, what type of data is being sent, etc.

{{<quote "Berty" "https://berty.tech/blog/metadata-mobile-messaging/">}}
if the data is a letter, the metadata is the envelope and its associated information (address, time, date, size???)
{{</quote>}}

### Why should I care?
{{<quote "Edward Snowden">}}
Metadata is extraordinarily intrusive. As an analyst, I would prefer to be looking at metadata than looking at content, because it's quicker and easier, and it doesn't lie.
{{</quote>}}

Think of it like this: if you see someone having a conversation with a known drug dealer, even if the actual conversation wasn't heard, there can be some fairly accurate assumptions about what's going on. Similarly, even if the actual messages are encrypted, metadata about the messages can be incredibly revealing.

{{<quote "Examples from the EFF" "https://www.eff.org/fr/deeplinks/2013/06/why-metadata-matters">}}
- They know you received a call from the local NRA office while it was having a campaign against gun legislation, and then called your senators and congressional representatives immediately after. But the content of those calls remains safe from government intrusion.
- They know you called a gynecologist, spoke for a half hour, and then called the local Planned Parenthood's number later that day. But nobody knows what you spoke about.
- They know you spoke with an HIV testing service, then your doctor, then your health insurance company in the same hour. But they don't know what was discussed.
- They know you called the suicide prevention hotline from the Golden Gate Bridge. But the topic of the call remains a secret.
{{</quote>}}

As you can see, it's pretty easy to figure out what's going on in someone's life, even if you don't know the exact words used in each phone call or conversation.

{{<quote "ex-NSA Chief Gen. Michael Hayden" "https://abcnews.go.com/blogs/headlines/2014/05/ex-nsa-chief-we-kill-people-based-on-metadata">}}
We kill people based on metadata.
{{</quote>}}

### What can I do?
In the case of messaging, the best thing you can do is use privacy-friendly services that either have little to no metadata or encrypt your metadata, like [Threema](https://threema.ch/en/blog/posts/metadata), [Signal](https://signal.org/blog/sealed-sender/), [Session](https://getsession.org/blog/metadata-zero-privacy), etc.

In the case of your files, there are [metadata removal tools](https://www.privacyguides.org/metadata-removal-tools/) you can use before you share them with someone or post them online.

Whatever you do, minimize metadata.

## Get your info here
[Privacy Guides](https://privacyguides.org)

[AlternativeTo](https://alternativeto.net)

[ToS;DR](https://tosdr.org "Terms of Service; Didn't Read")

[Techlore](https://techlore.tech) - also has a [YouTube channel](https://www.youtube.com/c/Techlore)

[The New Oil](https://thenewoil.org) - also has a [YouTube channel](https://www.youtube.com/c/TheNewOil)

[Surveillance Report](https://surveillancereport.tech) - presented by Techlore and The New Oil, also has a [YouTube channel](https://www.youtube.com/c/SurveillanceReport)

[Plexus](https://plexus.techlore.tech)

You can also join the [Privacy Guides](https://www.privacyguides.org/#we-need-you-heres-how-to-get-involved), [Techlore](https://techlore.tech "You can find their socials in the top right corner") and [The New Oil](https://thenewoil.org/links.html) communities. They're super friendly and will help you with whatever privacy- or security-related questions you have.
