---
title: Messengers
description: The right and wrong places to talk to people
date: 2022-05-06
lastmod: 2023-01-18
author: noClaps
---

## Intro

This post of the Privacy and Security series will talk about different messengers, their pros and cons, and what makes a good messenger good and a bad messenger bad. Turns out its not as simple as "I send message, person get message", there's a lot that goes into making a properly private and secure messaging service.

For those of you that have been living under a rock, or have simply forgotten what a messenger is, it's a platform or way for people to send messages to one another and communicate. Technically, post and email are messengers, but what we're here to talk about are instant messengers. I will talk about email in a separate post, because its also a relatively broad topic.

As I mentioned in the [Intro post](/tech/psa/intro), privacy, security and anonymity are different things, and that's gonna be a little clearer in this post as we compare different messengers.

There's gonna be a lot of links in this post, because references are necessary. Otherwise, who's gonna believe the words of some random person on the internet? But if you put a link to an article or blog post written by some other random person on the internet, it's all trustworthy.

I'm also gonna talk about a lot of messengers, but I'm also gonna miss out on a lot of messengers, because there are way too many and my attention span doesn't like that. I'll just make a checklist at the end of what a messenger should have (according to me), and if your platform sounds like it fits everything, use it. Or don't and use whatever you want, not much I can do about it anyway.

Sit back and relax, because this is gonna be a long one.

## Unencrypted messaging

No encryption is pretty easy to explain, there's just nothing there to protect you. Having no encryption means that your messages are freely accessible to the providers, the government, and pretty much anyone else who wants to see them. This has lead to data leaking from these platforms in the past, and they should not be used for extended communication. This is probably the worst-case scenario, and unfortunately _really_ common.

### SMS

One of the [most popular forms of messenger](https://en.wikipedia.org/wiki/Text_messaging#Worldwide_use), SMS, has [no encryption](https://en.wikipedia.org/wiki/Instant_messaging#Encryption). This means that governments, companies, hackers, and anyone with basic tools can [see all of your messages](https://theconversation.com/how-hackers-can-use-message-mirroring-apps-to-see-all-your-sms-texts-and-bypass-2fa-security-165817). While this might not be worrying, because "who even uses SMS?", [many services use SMS as two-factor authentication (2FA)](https://dataprot.net/statistics/two-factor-authentication-statistics/#two-factor-authentication-statistics), including banks. This can allow any attackers to get your SMS 2FA codes and log in to your bank account, often without your knowledge.

It gets worse. There's a global telecom network known as [Signaling System 7 (SS7)](https://en.wikipedia.org/wiki/Signalling_System_No._7), which turned out to have a [really serious security hole](https://thehackernews.com/2014/12/hackers-can-read-your-private-sms-and.html) that allowed hackers to see and record calls, messages, location information, etc., of any person on the network. The thing is, nearly every telecom operator (Verizon, SingTel, Jio, Vodafone, etc.) around the world uses this protocol, and it's the reason you can call or SMS someone using a different provider. They weren't bothered about these flaws at all, their logic being, "You need lots of tech and money and stuff to exploit this, no one's gonna do it."

Until of course, [someone did](https://thehackernews.com/2017/05/ss7-vulnerability-bank-hacking.html).

And that's why you **don't use SMS for anything** even remotely important. Use encrypted platforms like [**Signal**](#signal), [**Threema**](#threema), [**Session**](#session), [**Element**](#elementmatrix) or any other end-to-end encrypted messenger.

### Twitter DMs and Reddit Chat

These are encrypted with your standard [HTTPS encryption](/tech/psa/intro#the-green-lock) that comes with most websites and web-based apps. However, they don't have any dedicated encryption protocols, which is why they're in this section. This has lead to [data leaking](https://arstechnica.com/information-technology/2020/07/hackers-obtained-twitter-dms-for-36-high-profile-account-holders/) from these platforms in the past.

I would recommend using other platforms like [**Session**](#session), [**Element**](#elementmatrix) or [**Threema**](#threema) instead, if you want to remain "anonymous" like you can on Twitter or Reddit.

## Encryption with trust

This is the section with the most well-known messaging apps. A lot of the trust comes down to the apps and/or servers being closed-source. Closed-source essentially means that a service, like WhatsApp, could _say_ that your messages aren't being looked at, but there's no real way to verify that, since you can't see the source code. The importance of open source was highlighted in my [Intro post](/tech/psa/intro#open-source-everything).

### Discord

Discord is one of the most popular communication platforms, especially for large communities in the gaming world.

According to [Discord's privacy policy](https://discord.com/privacy) (you know, that thing you agree to and never actually read?), [Discord can read all of your private messages](https://edit.tosdr.org/points/9070). While chats are encrypted in transit to Discord's servers and encrypted at rest on your devices (at least that's what they _say_), they're [stored unencrypted on Discord servers](https://www.techspot.com/article/2340-messaging-apps-encryption/#Discord). And the privacy toggles in the app settings mean basically nothing since they'll store the data anyway.

On top of that, Discord has outright [refused to implement end-to-end encryption](https://www.reddit.com/r/discordapp/comments/8nzb5d/why_is_discord_so_antiencryption/e001lr1/), giving the same ["think of the children" argument](/tech/psa/intro#why-is-encryption-important) we discussed in the Intro post. [And they can't even do that well!](https://endsexualexploitation.org/articles/discord-is-a-haven-for-gamers-and-sexual-exploiters/)

In 2020, [some researchers reverse-engineered Discord](https://medium.com/tenable-techblog/lets-reverse-engineer-discord-1976773f4626) and found that:

::: quote
Discord servers decrypt and inspect all user’s audio/video data server-side in real-time.
:::

This means that Discord was able to listen to and watch everything that was going on in video and audio calls. Does this mean they were doing it? Probably not, but it's scary to think that they could.

I want to list some pros of Discord, just to balance the argument, but from a privacy and security perspective there don't seem to be many. Discord and its founder have had a [long history of shady practices](https://youtu.be/uvNkdAggUGU), and I have no doubt that this is something that will continue for a long, long time.

In conclusion, not a good service, do not recommend. Use [**Element**](#elementmatrix) or [**Revolt**](https://revolt.chat/) instead. If you _must_ use Discord, try [**Fosscord**](https://fosscord.com/).

### WhatsApp

WhatsApp is the most used messaging app in the world, with over [2 billion users worldwide](https://blog.whatsapp.com/two-billion-users-connecting-the-world-privately). There are quite a few problems with WhatsApp, but it's a relatively safer platform than most of the options in this section.

The main thing is, WhatsApp is closed-source. The reason this is an issue is that they _say_ they have end-to-end encryption, but there's no way to be sure of that. It's entirely possible that they're lying and can clearly see all of your messages. Is that actually happening? No, probably not. They state that they cannot read end-to-end encrypted content, which includes:

::: quote WhatsApp FAQ {href="https://faq.whatsapp.com/general/security-and-privacy/end-to-end-encryption"}
messages, photos, videos, voice messages, documents, status updates and calls
:::

Note that WhatsApp doesn't encrypt payments, metadata or,

::: quote WhatsApp encryption whitepaper {href="https://www.whatsapp.com/security/WhatsApp-Security-Whitepaper.pdf"}
Communications with a recipient who elects to use a vendor to manage their API endpoint are not considered end-to-end encrypted.
:::

Along with that, WhatsApp backups to Google Drive are [not encrypted by default](https://www.eff.org/deeplinks/2021/09/whats-whatsapp-encrypted-backups), and weren't encrypted at all for the longest time. This means your chats, images, videos, etc., were and might still be sitting unencrypted on Google's servers if you do happen to use Google Drive backup. If you happen to use WhatsApp with a Google account, be sure to go into the app's settings and check that you have encrypted backups enabled.

In addition to that, WhatsApp is owned by Meta/Facebook, one of the world's most privacy-invasive companies (just look at the [lawsuits they're involved in](https://en.wikipedia.org/wiki/Lawsuits_involving_Meta_Platforms)), which doesn't help its case.

[WhatsApp also doesn't encrypt metadata](https://medium.com/@m.muslimiblog/metadata-the-whatsapp-issue-affecting-you-2bf13e77d065), so Meta/Facebook can see all of that and use it to [shadow-profile](https://en.wikipedia.org/wiki/Shadow_profile) you.
However, since WhatsApp (probably) does use end-to-end encryption, it's one of the less bad options on this list. Security-wise, I think WhatsApp is fine, most of its issues come from the privacy-invasive practices of Meta/Facebook. If you have **absolutely no other option**, or you trust Meta/Facebook for whatever reason, WhatsApp is mostly fine to use. However, I would recommend that you try out other platforms like [**Signal**](#signal), [**Threema**](#threema) or [**Session**](#session) first, since they are much more private and secure than WhatsApp ever will be.

::: note
I keep saying "Meta/Facebook" because so many people think of them as separate companies, and not just the renaming that it was. One of the main reasons for the rebranding was so that people would forget about all the horrible things that Facebook had done over the years when it was renamed, and Meta could have a fresh start. Admittedly, I never thought it would work, because you don't just forget years and years of privacy violations and security vulnerabilities, but it turns out people either completely ignorant or oblivious, or both.
:::

### Telegram

This is one of those ones that's heavily debated both in and outside the privacy community, and for good reason too.

Telegram's biggest flaw is that they don't use end-to-end encryption by default. All the encryption is done on Telegram's servers, so there is an immense amount of trust you have to place in Telegram to make sure that they aren't reading your messages or giving them away.

While the Telegram apps are [free and open source](https://telegram.org/apps#source-code), the server isn't. This means that there is no way to verify what goes on in the servers, and most importantly, if the encryption actually takes place.

However, this is a relatively easily solved problem. You can use Telegram's secret chats, which is [end-to-end encrypted](https://telegram.org/faq#secret-chats). Also, Telegram calls and video calls are end-to-end encrypted too. However, secret chats are only for 1-on-1 chats, and so groups chats aren't end-to-end encrypted, whether public or private.

One of the main reasons that people choose to trust Telegram is their [refusal to process data requests](https://telegram.org/faq#q-do-you-process-data-requests) from law enforcement, governments, etc.

In conclusion, I would not recommend this app unless you're willing to use **only secret chats**. Using normal or group chats in Telegram places a lot of trust in them, and trust can be dangerous. For most people, you're better off using [**Signal**](#signal), [**Threema**](#threema) or [**Session**](#session) for small groups and 1-on-1 chats, and [**Element**](#elementmatrix) or [**Revolt**](https://revolt.chat/) for the larger communities. Honestly, I believe even WhatsApp is better than using Telegram for most people, especially if you have group chats or aren't willing to set up secret chats for every contact you have.

### iMessage

iMessage is [end-to-end encrypted](https://www.apple.com/privacy/features/#imessage) **only** if you're in blue-bubble mode. Green-bubble mode is SMS, which is completely unencrypted. You do have to trust that Apple really is encrypting your messages on your device, and they aren't able to see them without your knowledge or permission.

However, if you happen to have iCloud backups turned on, [all of your messages are stored unencrypted on Apple's servers](https://www.howtogeek.com/710509/apples-imessage-is-secure...-unless-you-have-icloud-enabled/), freely available for Apple, the government, and anyone who Apple allows to look at them.

Sure, Apple's security is probably strong enough that most hackers won't be able to easily break in and see your messages. However, nothing is 100% secure, and there is a good chance that someone, with enough effort and determination and luck, will find a way in. Plus, why even let Apple see what you talk to your friends about? That should be something that stays between you and your friends. The simple solution to this is to [turn off iCloud backups](https://www.howtogeek.com/662872/how-to-disable-and-delete-icloud-backup-on-iphone-and-ipad/), which you should do anyway since Apple [isn't a](https://www.washingtonpost.com/technology/2019/05/28/its-middle-night-do-you-know-who-your-iphone-is-talking/) [very](https://www.eff.org/deeplinks/2021/08/apples-plan-think-different-about-encryption-opens-backdoor-your-private-life) [trustworthy](https://www.reuters.com/article/us-apple-fbi-icloud-exclusive/exclusive-apple-dropped-plan-for-encrypting-backups-after-fbi-complained-sources-idUSKBN1ZK1CT?feedType=RSS&feedName=technologyNews) [company](https://tosdr.org/en/service/158). If you need a cloud storage solution to replace iCloud, there's other better options I'll talk about in a future post, and you can find some on [Privacy Guides](https://www.privacyguides.org/cloud/).

### Facebook Messenger and Instagram DMs

Facebook Messenger has an option to enable end-to-end encrypted [chats, voice and video calls](https://messengernews.fb.com/2021/08/13/messenger-updates-end-to-end-encrypted-chats-with-new-features/) . Meta/Facebook are also testing [end-to-end encryption in Instagram DMs](https://about.fb.com/news/2021/12/metas-approach-to-safer-private-messaging/). However, since these aren't enabled by default, most people don't use them, because such is the power of defaults.

Again, use other platforms like [**Signal**](#signal), [**Threema**](#threema) or [**Session**](#session), or at the very least enable end-to-end encryption where you can.

## Trustless Encryption

This section has end-to-end encrypted open-source apps with reproducible builds, so you can see for yourself what goes on in the app, and there is very little trust you have to place in the developers. I can recommend all of the apps in this section, and have personally used / am currently using them. The apps serve different purposes, though, so keep that in mind if you do want to switch.

### Signal

**Signal** is an open source messenger (and a [nonprofit foundation](https://en.wikipedia.org/wiki/Signal_Foundation)) that uses their own [Signal Protocol](https://en.wikipedia.org/wiki/Signal_Protocol) for end-to-end encryption. This protocol is used by a whole bunch of other messengers, like [WhatsApp](https://signal.org/blog/whatsapp-complete/), [Google's RCS Chat](https://www.theverge.com/2020/11/19/21574451/android-rcs-encryption-message-end-to-end-beta), [Facebook Messenger's Secret Conversations](https://signal.org/blog/facebook-messenger/) and [Skype's Private Conversations](https://signal.org/blog/skype-partnership/).

The Signal Protocol has been [audited](https://en.wikipedia.org/wiki/Signal_Protocol#History) multiple times and has been found to be "cryptographically sound". It's used by some of the largest companies out there, so clearly they've done it right. Nothing is 100% secure, but the Signal Protocol is one of, if not **the** best, encryption protocol out there for messengers.

One thing I have to clarify, Signal will not make you anonymous. You need a phone number to sign up. In many countries, your phone number is tied to your identity, so if you're looking for complete anonymity, then this might not be the solution for you. However, if you want world-class security and privacy in a messaging app to use with your friends and family, Signal might be the solution for you. I can recommend it as an alternative to platforms like WhatsApp, Facebook Messenger, iMessage, SMS, RCS Chat, Telegram, and most other instant messaging platforms.

Signal has most of the features that people use in messaging apps, but it may not have **all** of the features that are available on other platforms yet. The developers are working hard on adding new features while maintaining your privacy and security, but since other platforms do not focus as much on user privacy and security, they can add features much more quickly than Signal can. If you want to suggest a feature, you can do so on their [community](https://community.signalusers.org/) or by opening an issue on their [GitHub](https://github.com/signalapp) in the respective repo. You can [donate to them here](https://signal.org/donate/), or if you do it through the app, you can get a cool [Donor badge](https://support.signal.org/hc/en-us/articles/4408365318426-Sustainers-Boost-Badges).

Signal also provides a [list of government orders](https://signal.org/bigbrother/) that they receive, and what they're able to provide. Usually it's not much, since Signal collects little to no data/metadata.

One thing I have to add, Signal's server code is almost fully open source. This doesn't really matter since you can't see what's actually running on the servers anyway, and they won't be able to see your messages with end-to-end encryption. However, I say **almost** because there's a small part related to [spam blocking](https://signal.org/blog/keeping-spam-off-signal/) that's closed source, since it's a bit difficult to stop spammers when they can see the code being used to block them. Personally, I don't have a problem with this, but I could understand it being an issue if you're looking for 100% transparency. However, one could argue that you can't really verify that the published server code is the same code actually running on the servers, so it wouldn't really matter either way.

In conclusion, an excellent app for most use cases with world-class privacy and security. I would highly recommend it for most people as their regular messenger. There's a few features I'd personally really like it to have, but for the most part I'm fine with it.

- [Website](https://signal.org/)
- [GitHub](https://github.com/signalapp)
- [Terms and Privacy Policy](https://signal.org/legal/)
- [Donate](https://signal.org/donate/)

### Session

**Session** is a fork of Signal that's meant to provide you with complete anonymity. Just like Signal, it's open source. That's about where the similarities end, though.

Session uses their own [Session Protocol](https://getsession.org/blog/session-protocol-technical-information) for end-to-end encryption. If you're worried about security as compared to Signal, Session has been [audited](https://blog.quarkslab.com/resources/2021-05-04_audit-of-session-secure-messaging-application/20-08-Oxen-REP-v1.4.pdf) before. Also, since it's open source, you can look through the code and audit it yourself if you choose / are able to do so.

Session is also completely [decentralised](https://en.wikipedia.org/wiki/Decentralization), which means that there's no central server as there is in almost every other messenger, including Signal. This makes Session censorship resistant, since the servers are in different countries and there's no way to track the messages. You can even [host your own servers in the Oxen network](https://docs.oxen.io/about-the-oxen-blockchain/oxen-service-nodes), which Session runs on.

The Oxen network is based on the Oxen blockchain, which a lot of people aren't very fond of. However, the $OXEN cryptocurrency has very little to do with the actual Session app itself, it's only related to the hosting of Oxen service nodes, which most people shouldn't have to worry about.

In addition to all of that, messages in Session are [onion routed](https://en.wikipedia.org/wiki/Onion_routing). If you don't know what onion routing is, essentially the messages are covered in several layers of encryption. When you send a message, say from Estonia, the outermost layer of encryption only reveals the data of where it needs to go next. Say it goes to a node in Germany. There, a layer of encryption will be "peeled" away, like an onion's layer, revealing an inner layer of encryption, which reveals where the data needs to head next. From there, it could go to Canada, for instance. Again, another layer is "peeled" away, revealing the data's next destination. This is repeated a few times (usually 3-4) until the data reached the recipient's device, where it is decrypted so that they can read it. However, since each node only knows where the data is coming from and where it's going next, and nodes can handle a _lot_ of traffic, it's **really** hard to tell where the message came from. That's what makes Session (and other onion routed stuff, like [Tor](https://www.torproject.org/)) anonymous. It's not perfect, but it's good enough to work for most high-risk [threat models](/tech/psa/threat-modelling).

Session also doesn't use any identifiers, like phone numbers or email addresses, and they collect almost zero data, so there's really [nothing to leak](https://getsession.org/faq#identity-protection) or give away even if some government agency comes knocking on their door. All they have to identify you is an autogenerated Session ID so other people can contact you, and a [recovery phrase](https://getsession.org/faq#recovery-phrase) so that you can carry your Session ID over to other devices. Your contacts and messages are [locally stored](https://getsession.org/faq#restored-contacts-and-messages), so you won't be able to carry them over to new devices. There's currently no backup system either, though it is [planned](https://getsession.org/faq#backups) to be added.

Session also has a feature called [open groups](https://getsession.org/faq#open-groups), which is similar to channels in Telegram. These are self-hosted and not fully decentralised, and the server stores the entire message history of the open group. Also, since open groups can contain thousands of users, the messages sent aren't end-to-end encrypted, only encrypted in transit. This feature is optional, and you can just as easily make a closed group for your contacts, and it'll be end-to-end encrypted, just like normal chats.

In conclusion, Session isn't for most people. It's not a very effective replacement for messengers like WhatsApp, since it's missing a lot of the features that people use. However, if you need a messenger that can give you near-complete anonymity, privacy and security at the cost of convenience, then Session might be the solution for you.

- [Website](https://getsession.org/)
- [GitHub](https://github.com/oxen-io)
- [Privacy Policy](https://getsession.org/privacy-policy)
- [Terms of Service](https://getsession.org/terms-of-service)

### Element/Matrix

**Element** is an open source decentralised messenger that uses the **Matrix** protocol to work. You can use [other Matrix clients](https://matrix.org/clients/) that may provide different UIs and features. I recommend Element since it provides the most complete Matrix experience, having been [founded by the team behind Matrix](https://element.io/#matrix-card).

Matrix behaves similarly to email, since you have multiple "homeservers" that you can get your Matrix ID from. You can talk to people using other homeservers, just like you can do with email providers. You can also [host your own homeserver](https://matrix.org/docs/guides/installing-synapse), which gives you much more control over what happens in it. (This is called [decentralisation](https://en.wikipedia.org/wiki/Decentralization), by the way. And yes, email is technically decentralised.)

Matrix has many, many features from other messengers. They have rooms, which behave similarly to channels in Discord or Telegram. They have one-to-one chats as well as group chats, which are end-to-end encrypted. They have Spaces (in beta at the moment), which are similar to Discord servers, and can house multiple rooms under them. Not many Matrix clients support this feature yet, but Element does.

Matrix also has many unique features, but the one that intrigues me the most is [bridges](https://matrix.org/bridges/). Bridges are a feature that allows Matrix to interoperate with other services, like WhatsApp, Signal, Discord, iMessage, Telegram, and so many more services. However, bridging can reduce the effectiveness of the end-to-end encryption in the app you're bridging to, if they do support it, so keep that in mind if you do choose to set that up.

For the people who aren't technically advanced, but still want their own server and/or bridges, you can use [Element One](https://element.io/element-one), [Beeper](https://www.beeper.com/) or one of many other Matrix hosting providers out there willing to host it for you. They're mostly paid though.

Matrix isn't fully trustless since you have to trust the owner of your homeserver, but since private messages and group chats are end-to-end encrypted, the server owner can't see those messages anyway. Rooms and spaces can also optionally be end-to-end encrypted, though that's up to the room admin. The end-to-end encryption protocols used in Matrix are [Olm](https://gitlab.matrix.org/matrix-org/olm/blob/master/docs/olm.md) and [Megolm](https://gitlab.matrix.org/matrix-org/olm/blob/master/docs/megolm.md), based on the [Double Ratchet Algorithm](https://signal.org/docs/specifications/doubleratchet/) popularised by Signal. They've been [audited](https://matrix.org/blog/2016/11/21/matrixs-olm-end-to-end-encryption-security-assessment-released-and-implemented-cross-platform-on-riot-at-last).

In conclusion, Matrix can work great for a whole variety of use cases. It's mostly used for Slack- or Discord-style communities/groups, and it's a great alternative for those. There's some features that you might miss from Discord or other platforms, but it's there for the most part. Plus, you can always bridge to Discord or Slack so you don't have to interrupt your workflow. Element even has a UI option to make chats look similar to Discord, rather than the chat bubbles you have in most messenger apps. You can use Matrix for your day-to-day conversations with end-to-end encryption, and ignore rooms and spaces entirely. The only con of Matrix that I can think of is that it's slightly more difficult to set up than other messengers, and the amount of settings in Element can be overwhelming for some.

::: warning
I've used Element for a while on Android, and I haven't had the best experience on it. There wasn't anything too severe that would prevent me from using the app, but there were small bugs that kept annoying me until I eventually deleted it. Your experience may be different, and this isn't meant to discourage you from using Matrix. I'm just talking about my experience with the app. Keep in mind that this is only about Element on Android. I haven't used it on other platforms enough to be able to provide a proper review. If you'd like to try them, there are [other clients](https://matrix.org/clients/) that you can use instead.
:::

#### Element

- [Element Website](https://element.io/)
- [GitHub](https://github.com/vector-im)
- [Legal](https://element.io/legal)

#### Matrix

- [Matrix Website](https://matrix.org/)
- [GitHub](https://github.com/matrix-org)
- [Legal](https://matrix.org/legal/)
- [Supporters](https://matrix.org/supporters/)

### Threema

**Threema** is probably one of the most feature-rich messengers that actually keeps your privacy and security in mind. They use [end-to-end encryption](https://threema.ch/en/faq/why_secure) with the open source [NaCl](https://nacl.cr.yp.to/) library. They have open source clients and have been [audited](https://threema.ch/en/blog/posts/audit-2020-en), which makes them quite easy to recommend. Threema is also based in Switzerland, the country with some of the [strongest data](https://en.wikipedia.org/wiki/Information_privacy_law#Switzerland) [protection laws](https://datenrecht.ch/ndsg-en/) in the world, which, in my opinion, gives them an edge over the other messengers, most of which are [based in the US](https://en.wikipedia.org/wiki/Information_privacy_law#United_States).

I can't give too many details about Threema, simply because I haven't used it enough, but it seems to be one of the best, most polished, open source messengers out there. This may largely be due to its business model, which involves the user paying to use the app. Now, before you question how giving Threema your credit card can be considered private, you have the option to pay by Bitcoin if you wish. You also have the usual options of Visa/MasterCard, PayPal, bank transfer or going through your app store. This is a one-time payment, and you can use the app indefinitely after that.

Threema offers [clients](https://threema.ch/en/download) for Android, iOS, macOS, Windows, Linux (.deb/.rpm) as well as a web client, which is more than most of the messengers I've mentioned so far. However, you will need the mobile app first to use the desktop clients as you need to link them together first.

The biggest disadvantage of Threema that I can see is that [their app is paid](https://threema.ch/en/faq/why_not_free_of_charge). In a world of free apps like WhatsApp, Signal, Telegram, etc., a paid app like Threema doesn't stand much of a chance. To be fair to them, having a paid app means a clear business model as opposed to the shady data collection of most closed-source free apps.

In conclusion, a great messenger from a country with great privacy laws. I really wish they were a bit more mainstream, but alas it's a paid app, and not everyone wants/is able to pay for their privacy. With great alternatives like Signal, Session or Matrix, I don't see much reason for people to use this app, despite how great it is. If your friends, your family and you are able and willing to pay for your privacy, I would highly recommend Threema to be your messenger.

- [Website](https://threema.ch/en)
- [GitHub](https://github.com/threema-ch)
- [Privacy Policy](https://threema.ch/privacy_policy/)

## Conclusion

I know I missed out on a lot of popular messengers like Snapchat, Slack, WeChat, Line, Viber, Skype, etc., but there's so many out there I couldn't possibly fit them all into one post. However, if you're wondering how good your messenger app is in terms of privacy and security, here's a simple checklist for you:

- How is the app's security? Are they utilising end-to-end encryption, and if so, which protocol? Has it been audited? How often is it updated? These are all highly important for security. [I've already covered why e2ee is necessary](/tech/psa/intro#end-to-end-encryption-e2ee). Unaudited apps could have undiscovered security flaws and outdated apps may be behind on security patches.
- Is it open source?
- How is the company's reputation? Are they transparent with their customers? Do they interact with their community often? This can have a bigger impact on the trustworthiness of a company than most people realise.
- How's the company's privacy policy? You can look them up at [ToS;DR](https://tosdr.org "Terms of Service; Didn't Read") to get a general rating as well as simplified details of the privacy policy and terms of service for most popular services. This doesn't necessarily mean much, since companies can change or break their terms of service and privacy policy any time they want, but a privacy-friendly privacy policy is still nice to have.

Those questions should about cover most messenger applications out there.

This post isn't about trying to get you to switch to another messenger (though if you do, that's awesome!), it's more to show how big companies can get away with shady stuff without most people knowing about it. It's also to show that you don't have to be stuck on your platform, and that you have options available to you if you wish to protect your privacy and security. The post is also meant to clear up misconceptions that arise from deceptive advertising that a lot of these companies do to promote their product(s).

I've heard plenty of reasons that people don't want to move away from their respective messaging apps, and they're all perfectly valid, no matter how miniscule they may seem to me. At the end of the day, it's up to you what messenger you want to use, and for what purpose. Do your research, try stuff out, see what sticks, and go with that.
