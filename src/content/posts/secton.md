---
title: Finding vulnerabilities in Secton
date: 2025-06-26
---

::: note Acknowledgements
I'd like to give credit to my friends, [InsidiousFiddler](https://codycody31.dev) and [RollViral](https://xnoid.studio), for helping out with this project. InsidiousFiddler has his own write-up of this, which you can find [here](https://codycody31.dev/when-security-is-not-a-factor-secton/). You can read that one or this one, they have basically the same content.
:::

I'd like to start off this post by stating that none of us are cybersecurity professionals. We just got bored and started messing around with stuff, and ended up finding some vulnerabilities along the way. Also, we did report everything we found to the developers and can confirm that it has all been fixed, at least at the time of writing this post. With that said, let's get started!

## Introduction

This story started with a project we found on GitHub, called [Changerawr](https://github.com/Supernova3339/changerawr). It's a tool that allows you to use AI to write changelogs based on your Git commits. InsidiousFiddler originally found the project, but realised that its hardcoded links to the Secton AI platform wouldn't work for him, so he forked it and started editing the code for his own needs. As he was looking through the code, he discovered a vulnerability that would allow you to get the user's Secton API key simply by calling the `/api/ai/settings` endpoint on a deployed instance of Changerawr, without any authentication.

He shared that with us, and as our curiosity got the better of us, we started wondering if we could find the developer's own instance of Changerawr. Using [DNSDumpster](https://dnsdumpster.com), we found it, and checking the `/api/ai/settings` endpoint did indeed reveal the API key. InsidiousFiddler reported this to the developer, and after a bit of back and forth, it was fixed.

## Secton

At this point, this had completely captured our attention, and we decided to investigate further. Through Changerawr, we discovered Secton. It turned out that the developer of Changerawr was also one of the developers of Secton, which would explain the hardcoded links in Changerawr.

[Secton](https://secton.org) is an AI platform, similar to [OpenAI](https://openai.com) or [Anthropic](https://anthropic.com), which provides an API and a chat UI to their AI models. It is unknown if they have their own custom models or simply modifications of existing models like GPT or Llama, but that's not relevant here anyway. Secton has two products: Platform (their developer platform) and Copilot (their chatbot).

### Copilot

As I am better at frontend development, I decided to investigate Copilot and its chat UI. It looks and behaves similar to [ChatGPT](https://chatgpt.com), with a text box and a messaging-app-style UI for conversations with the chatbot. Without being logged in, the website blocks you from sending further messages after about 10 messages or so, and asks you to sign in to continue sending messages. The signed in limit is about 100 messages, and for higher usage, you have to purchase their Copilot Plus subscription.

![Secton Copilot landing page](./secton-homepage.png)

In order to do this, the website would simply add a `disabled` attribute to the input `<textarea>` and submit `<button>` HTML elements. For context, the `disabled` attribute can be added to HTML elements to disable their interaction logic. For buttons, this would prevent you from clicking them, and for inputs, this would prevent you from entering text.

```html
<textarea disabled>...</textarea>
<button disabled>...</button>
```

However, these attributes can be removed simply by opening the browser's developer tools (Inspect Element), finding the element, and editing the HTML there. This shouldn't be an issue though, as usually the server enforces limits, while the UI is just to signal to the user that they aren't able to use it anymore. To Secton's credit, they did have a `/api/chat/guest-limits` endpoint which did correctly count and decrement the remaining usage per IP, returning the following:

```json
{
  "ip": "[REDACTED]",
  "count": 10,
  "limit": 10,
  "remaining": 0,
  "resetAt": "2025-06-23T17:17:24.201Z"
}
```

However, when I removed the `disabled` attribute from the elements, and sent a message, I got a response. I sent another, and got another response. It seemed that the server, though counting guest usage correctly, was not actually enforcing any limits, and would just let you talk to the AI endlessly. Given that part of their business model was charging for higher usage limits on Copilot, this was a huge vulnerability.

I decided to investigate further by looking at network requests on the website, and I discovered that it used a `/api/chat` endpoint to send and receive messages from the backend, so I decided to write a request to it myself in JavaScript:

```ts
const response = await fetch("https://copilot.secton.org/api/chat", {
  body: '{"prompt": "hi"}',
  cache: "default",
  credentials: "include",
  headers: {
    Accept: "*/*",
    "Accept-Language": "en-GB,en;q=0.9",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    Pragma: "no-cache",
    Priority: "u=3, i",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
  },
  method: "POST",
  mode: "cors",
  redirect: "follow",
  referrerPolicy: "no-referrer",
}).then((r) => r.text());
```

Most of the headers probably weren't necessary, but I'd taken it from the network requests I saw, and decided not to change it too much. This was the response I got:

```
data: {"response":"Hello","p":"abcdefghijklmnopqrstuvw"}

data: {"response":"!","p":"abcdefghijklmnopqrstuvw"}

data: {"response":" How","p":"abcdefgh"}

data: {"response":" can","p":"abcdefghijklmnopqrstuvwxyz0123456789abcdefgh"}

data: {"response":" I","p":"abcdefghijklmnopqrstuv"}

data: {"response":" assist","p":"abcdefghij"}

data: {"response":" you","p":"abcdefghijklmnopqrstuvwxyz012345"}

data: {"response":" today","p":"abcdefghijklmnopqrstuvwxyz0"}

data: {"response":"?","p":"abcdefghijklmnopqrstuvwxyz0123456789abcdefghij"}

data: {"response":""}

data: {"response":"","usage":{"prompt_tokens":755,"completion_tokens":10,"total_tokens":765}}

data: [DONE]
```

The server wasn't checking where the request was coming from, and I could call the API on my own without any authentication or limits! Using this, over the span of around 20 mins, RollViral and I built (using [Claude](https://claude.ai)) a small proof of concept of a chat UI using this API and deployed it. This allowed us to have unlimited access to Copilot without facing the annoyance of having to remove the `disabled` attribute.

![Our proof of concept website using the Copilot API](./copilot-poc.png)

### Platform

While I was playing around with Copilot, InsidiousFiddler was busy exploring Secton Platform. Unlike Copilot, this wasn't another unauthenticated API, and required him to sign up first. Once signed up, Secton provided a playground to test out the models.

However, instead of using the user's authentication token or something similar, the playground simply uses a completely public and free to use token: `playground`. And just like the Copilot API, this did not have any limits on its usage.

![A successful HTTP request using the `playground` Bearer Token](./platform-playground.png)

### Other endpoints and rate limiting

After seeing this, InsidiousFiddler decided to explore Secton's other subdomains using DNSDumpster, and found two more that looked interesting: `speech-compute.secton.org` and `ai-compute.secton.org`.

The former was properly authenticated and refused entry, returning a `401 Unauthorized`:

![A failing HTTP request to `speech-compute.secton.org`](./speech-compute.png)

However, the latter also allowed unauthenticated access, similar to Platform and Copilot.

Another interesting thing we discovered was that rate limiting was implemented improperly. If someone were to spam the Copilot API, for instance, it wouldn't limit them, but would instead slow down and worsen the experience for everyone else using Copilot. It's likely this also applied to their other endpoints.

## Conclusion

In total, Secton had at least 3 endpoints that were publicly accessible, all of which are central to their business model. Despite having little-to-no experience with offensive security, we were able to find some major vulnerabilities. These were reported to the developers in a private chat, and were fixed (as best we could tell) by the following day.
