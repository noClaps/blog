#import "../../pages/post.typ": *

#metadata((
  title: [Intro to Privacy, Security and Anonymity],
  date: datetime(year: 2022, month: 4, day: 6),
  lastmod: datetime(year: 2023, month: 3, day: 9),
))
#show: post

I've really gotten into this stuff over the last 2 years or so. I probably shouldn't have, since I had a lot of (arguably) more important stuff going on during that time, and focusing on that might have been better for me and my future. But I digress.

A lot of the stuff I say here might end up sounding like I live in the woods with a tinfoil hat, but I promise you at least 90% of the things I say here are true as of posting this. I also want to make sure you know, a lot of the stuff mentioned here will probably change someday, whereas this post will probably not be updated often, if at all. So be sure that the information you're getting is up to date. I'll link a few good sources of information at the bottom that can help you stay up-to-date on your privacy and security knowledge.

Thanks to #link("https://mfw.omg.lol")[mfwmyfacewhen] for some of the ideas.

= Why should I care?

The online world is both a wonderful and terrible place. On one hand, you have #link("https://www.livescience.com/54094-how-big-is-the-internet.html")[more information available in the blink of an eye] than any library or school would ever be able to provide. You have a way to connect with people instantaneously through mediums like instant messaging or e-mail, discuss topics with thousands or millions of people at once on online forums and communities, and so much more. You can display your talents to an audience so large it's mind-boggling. There are many, many improvements to everyday life that the internet has brought with it. It's never been easier to be completely free and uncensored.

As with everything, where there is a positive, there's a negative to rival it. There are constantly people and companies trying to take control of you and your behavior for their own benefit. Companies like Google, Facebook, Microsoft, Amazon, etc., all make #link("https://www.visualcapitalist.com/how-big-tech-makes-their-billions-2020/")[millions and millions of dollars] every year just from your personal information. And you don't get a penny of that back. Not only that, these companies have immense political power, mainly through #link("https://www.cnbc.com/2020/01/22/how-much-google-facebook-amazon-and-apple-spent-on-lobbying-in-2019.html")[lobbying] and collaborations with the US government in surveillance programs like #link("https://en.wikipedia.org/wiki/PRISM_(surveillance_program)")[PRISM].

Along with that, there's manipulation for things #link("https://en.wikipedia.org/wiki/Facebook%E2%80%93Cambridge_Analytica_data_scandal")[as big as US presidential elections], and danger for #link("https://en.wikipedia.org/wiki/School_Strike_for_Climate#Censorship")[activists], #link("https://en.wikipedia.org/wiki/Whistleblower#Risks")[whistleblowers], #link("https://en.wikipedia.org/wiki/Lavabit#Suspension_and_gag_order")[privacy-friendly services], and more. While your situation #link("/posts/threat-modelling")[may not be as extreme] as these, it's always good to have control over your decisions, your information, and most importantly, your life.

Don't expect the government to come and save you either. The unfortunate part of all of this is that laws aren't able to catch up with the rapid development of the internet. In many cases, it's hindered by power-hungry politicians or greedy companies lobbying and manipulating said power-hungry politicians, making a never-ending loop of power and corruption. That leaves people like you and me in a state of helplessness, constantly being controlled and profited on, without getting any returns out of it.

I hope this explains why you should care about your own privacy. It's because *no one else does*.

= PSA - Privacy, Security and Anonymity

People often confuse these 3 terms, and while they can be interchangeable in a few situations, they are very different things and should be treated as such.

- #link("https://en.wikipedia.org/wiki/Privacy")[*Privacy*] is when you have control over your personal information and who can see it.
- #link("https://en.wikipedia.org/wiki/Computer_security")[*Security*] is when you have protection from unauthorized malicious actors.
- #link("https://en.wikipedia.org/wiki/Anonymity")[*Anonymity*] is when you have a completely unknown/untraceable identity.

It's possible to have one but not the others, and depending on what you're looking for, the tools you use will differ. For instance, #link("https://www.torproject.org/")[Tor] is a much better tool for *anonymity*, whereas it's not as good as #link("https://www.chromium.org/Home/")[Chromium] for *security*, which is not as good as #link("https://www.mozilla.org/en-US/firefox/new/")[Firefox] for *privacy*.

There aren't many tools that'll give you privacy, security as well as anonymity, so make sure you know the difference between these 3 concepts, because it will really help you choose the right tools and services for the job. Also, whatever you choose, make sure it actually works for you, and you aren't just picking it because some person on the internet told you to. A lot of the time, people get frustrated with trying to achieve privacy because the things that internet strangers "force" them to use doesn't work for them, and they give up entirely.

= Open source everything

#link("https://www.redhat.com/en/topics/open-source/what-is-open-source")[Open source] means that the source code of the software is publically available to view and scrutinise. Source code is usually stored in repositories like #link("https://github.com")[GitHub], #link("https://gitlab.com")[GitLab], #link("https://codeberg.org")[Codeberg], etc., though that is not a requirement of any #link("https://opensource.org/licenses/")[open source license].

One of the most common misconceptions in the privacy community is that open source is better than closed source, and that everything should be open source and available for free. This is usually due to something called Linus's law, which states:

#quote(
  title: [Understanding Linus's Law for open source security, Seth Kenlon, opensource.com],
  href: "https://opensource.com/article/21/2/open-source-security",
)[
  given enough eyeballs, all bugs are shallow.
]

This stems from the belief that being able to see and audit the source code makes it more secure, and that the more eyes there are on the code, the more bugs and vulnerabilities can be caught and the more secure and private the software will be. In an ideal world, this would work. If all source code had many eyes on it, and was constantly being tested and audited by the public, and abandoned projects were being revived in forks, then something being open source would be a much more compelling argument for it. Companies would likely open source more software as they are effectively getting free labor out of it, as well as keeping their users happy by allowing them to develop the software how they wish.

However, the reality of the situation is that something being open source #link("https://seirdy.one/posts/2022/02/02/floss-security/")[doesn't necessarily give it] an advantage or disadvantage in terms of privacy and security. There are many cases where a closed source product can be #link("https://madaidans-insecurities.github.io/firefox-chromium.html")[more private and secure] than an open source one isn't. More than that, open source software also #link("/posts/operating-systems")[isn't always the best] in terms of user experience, and so even if it were more private, it wouldn't gain mass adoption.

= Encryption

This is one of those big fancy "security professional" words that most people tell themselves they understand to look smart in front of their friends. And that's exactly what I'm gonna do too, because I am by no means a security professional.

Encryption is important. It's what protects your stuff from being openly available to anyone on the internet. But not all encryption is equal, some kinds of encryption are better than others for certain purposes.

== Why is encryption important?

Imagine you're talking to your friend about something sensitive and personal to you. The only reason you're talking to them about it is because you trust them. Now imagine what it would feel like if someone was hiding, listening to your whole conversation, and then proceeded to tell everyone about this very personal thing that you didn't want anyone to know.

Having encryption is the equivalent of having a secret language that you and your friend made up and speak in. Whether that's something as simple as a #link("https://en.wikipedia.org/wiki/Caesar_cipher")[Caesar cipher], or something as complex as #link("https://en.wikipedia.org/wiki/Pretty_Good_Privacy")[PGP], it's all a kind of encryption. Of course, PGP is a much stronger encryption protocol than a Caesar cipher, and there are better encryption protocols out there made specifically for different things.

== Nothing to hide

Many people will try to convince you that encryption is bad, and that you don't need encryption if you have #link("https://en.wikipedia.org/wiki/Nothing_to_hide_argument")[nothing to hide]. They'll make arguments like "Removing encryption can help us catch criminals, like terrorists and pedophiles. THINK OF THE COUNTRY! THINK OF THE CHILDREN!", implying that anyone who uses encryption is a criminal that has something to hide. I don't support crime, but removing encryption entirely and spying on everyone seems to me like a "guilty until proven innocent" system. Also, the government wouldn't be the only one who would have access to your data, so would every hacker and bad internet person out there. You can't implement a backdoor only for one person, if it's there anyone can use it. There have even been cases where #link("https://krebsonsecurity.com/2022/03/hackers-gaining-power-of-subpoena-via-fake-emergency-data-requests/")[hackers posed as the police to get data from companies]!

Then again, these are the same people #link("https://en.wikipedia.org/wiki/Mass_surveillance#By_country")[running] #link("https://en.wikipedia.org/wiki/PRISM_(surveillance_program)")[mass] #link("https://en.wikipedia.org/wiki/Five_Eyes")[surveillance] #link("https://www.businesstelegraph.co.uk/the-secret-police-cops-built-a-shadowy-surveillance-machine-in-minnesota-after-george-floyds-murder-mit-technology-review/")[programs] and hiding them from you, so who's really in the wrong here? #link("https://www.amnesty.org/en/latest/campaigns/2015/04/7-reasons-why-ive-got-nothing-to-hide-is-the-wrong-response-to-mass-surveillance/")["Nothing to hide" is an illogical argument] because privacy and security are basic human rights, not crimes or luxuries.

== The green lock

You've probably seen the green lock icon in your browser when you visit websites. That green lock tells you that you're using something called #link("https://en.wikipedia.org/wiki/HTTPS")[HyperText Transfer Protocol Secure (HTTPS)]. This is a bit complicated, but for the most part, it means that the data you're sending and receiving from the websites you visit is encrypted using a protocol called #link("https://en.wikipedia.org/wiki/Transport_Layer_Security")[Transport Layer Security (TLS)], formerly known as Secure Sockets Layer (SSL). Here's a #link("https://howhttps.works/https-ssl-tls-differences/")[brief explanation of HTTPS, TLS and SSL].

The way that it works is:

+ You type in a URL into your search bar, like https://blog.zerolimits.dev.
+ This is then sent to your domain name service (DNS), which then converts the URL into an IP address.
+ This IP address, along with your IP address, is then sent to your internet service provider (ISP), which then sends it to the correct server for https://blog.zerolimits.dev.
+ The server sees your IP address, and sends back the HTML, CSS and JS files for the website, which then goes to your ISP, and finally back to your browser, which displays the page to you.

HTTPS encrypts your requests in transit, which means it can't be intercepted by any attackers, at least until it reaches the server you're connecting to. However, metadata about that connection, like the domain, is still exposed. What this means is that if you connect to a website, like `https://blog.zerolimits.dev/tech/psa/intro/`, the `/tech/psa/intro/` part will not be decrypted until it reaches its final destination. However, the `blog.zerolimits.dev` part of the URL will be visible to your ISP and DNS server, since they need that information to send you to the right place. This is a simplified explanation of HTTPS, and a more detailed explanation can be found at #link("https://howhttps.works/")[How HTTPS Works].

== End-to-end encryption (e2ee)

#link("https://en.wikipedia.org/wiki/End-to-end_encryption")[End-to-end encryption] is exactly what it sounds like, your data is encrypted from one end to the other, and no one in the middle is able to access it. It's also called "#link("https://tresorit.com/blog/zero-knowledge-encryption/")[zero-knowledge encryption]" in cases like cloud storage, since the provider has "zero knowledge" about your data.

It's arguably the most private and secure form of encryption, since it removes all trust from the provider. In end-to-end encrypted communication, the messages you send are encrypted on your device, sent to the server in encrypted form so they can't see your messages, and sent to the person you're talking to from there, where the message is then decrypted so that they can read it. In the case of cloud storage, the data is encrypted on your phone and sent to the server, where it's stored in its encrypted form. When you need the data back, the server sends it to you, and then you can decrypt it with your private key (your password, usually).

As you can see, if there is e2ee, there is no need to trust the provider, whether that's the messaging platform, cloud storage provider, etc., that they're not reading your content. This also highlights the importance of open source, since we can verify in open source apps if the data is actually being encrypted or not, whereas in closed source apps you need to trust the developers that they actually encrypt the data on your device before sending it to the server.

Obviously, e2ee is quite a bit more complicated than that, but that's about the gist of it.

= Metadata

== What is it?

The simplest way to define metadata is "data about data".

Imagine you take a photo of a tree on your phone. The data in this case would be the photo itself: the colors and positions of each pixel in the photo, basically what makes the photo a *photo*. The metadata would be additional information about the photo, like the location you took the photo at, the kind of lens you used, the date and time you took the photo, the ISO and focal length, etc. It's basically data about the photo.

In the context of messaging, the message you send, whether that's text, images, files, videos, audio, whatever, is the data. Everything about the message, like who you're sending it to, when you're sending it, when it's received, what type of data is being sent, etc.

#quote(
  title: [Berty],
  href: "https://berty.tech/blog/metadata-mobile-messaging/",
)[
  if the data is a letter, the metadata is the envelope and its associated information (address, time, date, size…)
]

== Why should I care?

#quote(
  title: [Edward Snowden],
  href: "https://www.zdnet.com/article/can-snowden-finally-kill-the-harmless-metadata-myth/",
)[
  Metadata is extraordinarily intrusive. As an analyst, I would prefer to be looking at metadata than looking at content, because it's quicker and easier, and it doesn't lie.
]

Think of it like this: if you see someone having a conversation with a known drug dealer, even if the actual conversation wasn't heard, there can be some fairly accurate assumptions about what's going on. Similarly, even if the actual messages are encrypted, metadata about the messages can be incredibly revealing.

#quote(
  title: [Examples from the EFF],
  href: "https://www.eff.org/fr/deeplinks/2013/06/why-metadata-matters",
)[
  - They know you received a call from the local NRA office while it was having a campaign against gun legislation, and then called your senators and congressional representatives immediately after. But the content of those calls remains safe from government intrusion.
  - They know you called a gynecologist, spoke for a half hour, and then called the local Planned Parenthood's number later that day. But nobody knows what you spoke about.
  - They know you spoke with an HIV testing service, then your doctor, then your health insurance company in the same hour. But they don't know what was discussed.
  - They know you called the suicide prevention hotline from the Golden Gate Bridge. But the topic of the call remains a secret.
]

As you can see, it's pretty easy to figure out what's going on in someone's life, even if you don't know the exact words used in each phone call or conversation.

#quote(
  title: [ex-NSA Chief Gen. Michael Hayden],
  href: "https://abcnews.go.com/blogs/headlines/2014/05/ex-nsa-chief-we-kill-people-based-on-metadata",
)[
  We kill people based on metadata.
]

The best thing you can do to protect against this is use privacy-friendly services that either have little to no metadata or encrypt your metadata. There are also #link("https://www.privacyguides.org/data-redaction/")[metadata removal tools] you can use before you share them with someone or post them online.

= What can I do?

Before you get started on your journey to making yourself more private, secure and/or anonymous, you should probably make a #link("/posts/threat-modelling")[threat model]. This will help you better decide the tools you should use, and what steps to take.

The most important thing to remember, however, is to take it slow. Taking too big of a leap into privacy-, security- or anonymity-oriented tools without fully understanding them isn't a great idea. You'll probably end up burning yourself out quickly, return back to your old habits because making the change was "too hard". It's fine to have a Google account and use Gmail if you need/want to, or if you're in the process of transferring over to a more privacy-friendly service. Using Windows, or listening to music on Apple Music, or shopping on Amazon isn't the end of the world.

There also isn't a point to going to extreme measures immediately. For instance, there's no point installing Qubes and trying to figure that out, when you have a public Facebook account with all of your personal information and social graph. You've only made using your computer more difficult for yourself, and haven't really improved your privacy very much. Try cleaning up your weaker areas one by one until you reach a point where you're comfortable.

Speaking of cleaning up, you want to minimise as much as you can. The more tools and services you use, the more of them have your data, and the higher the chance of it being misused or leaking out. Especially when you're starting out, think about if you _really_ need that dedicated recipe app or if you can just write it down in notes or on paper. Less is more.

Another thing is to consider carefully who you want to trust. In an ideal world, you'd trust no one, and verify everything, but you can't realistically do that. Don't trust people who say that they're the only ones you should trust, they are most likely trying to scam you into paying for one of their products.

I've linked a #link("#get-your-info-here")[few resources] that I believe to be trustworthy, at least as of writing this post. However, I highly encourage you to do your own research instead of blindly trusting what anyone says.

= Get your info here

#link("https://privacyguides.org")[Privacy Guides]

#link("https://privsec.dev")[PrivSec]

#link("https://grapheneos.org")[GrapheneOS]

#link("https://madaidans-insecurities.github.io/")[Madaidan's Insecurities]

#link("https://seirdy.one/")[Seirdy's Home]

#link("https://qua3k.github.io/")[segmentation fault]

#link("https://wonderfall.dev/")[Wonder's Lab]
