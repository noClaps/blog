#import "../../pages/macros.typ": *

#let title = [My takes on AI]
#let date = datetime(year: 2025, month: 2, day: 1)

There's been a lot happening in the AI world recently. There's a new model, DeepSeek R1, that's just come out that everyone's going crazy over, because it performs better than GPT o1 and Claude 3.5 while being significantly cheaper and, more importantly, open source. Of course, before this, all the hype was about GPT o1, and Claude before that.

I've mostly taken a backseat to all of this, though I still do keep up with tech news so I do know about all of these things happening. It's partly because I refuse to pay for Claude/ChatGPT and my internet's too slow to download models from Ollama, but also because my experience with these LLMs seems to have been vastly different from many other people's.

= Use cases

I suppose a good place to start would be my use case for these LLMs. I'm a physics student, so I'm mostly using them for physics and math problems. It seems like that's not AI's strong suit though, because it keeps getting things wrong. For example, my friend and I were doing some practice questions in preparation for our solid state physics exam, and we were confused about the classification of crystal structure of a material, so we asked both ChatGPT and Claude, and they both gave us the wrong answer.

I do also code sometimes, and this also happened when I was making #link("https://github.com/noClaps/highlight")[Highlight], I wanted to have it compile to WASM so that it could run in the browser, but my build kept failing. Eventually, after trying and failing to find a solution myself, I asked Claude, and it led me down weird configurations and SDKs and stuff, and none of them worked. In the end, I gave up, and Highlight only runs server-side (for now).

I'm not quite sure whether my use cases are out of the ordinary, and so the AI hasn't seen enough of those in the training data to be useful, or if I'm just asking the questions incorrectly.

#note(title: [Natural language])[
  I also don't understand why that last point is even a thing, considering how these AIs were supposed to be really good at understanding natural language, and yet we have to carefully formulate our "natural language" to get it to work correctly?
]

= Public opinions

Based on my experience, it's kinda been difficult to trust the results I get out of these AI tools. And yet I see people whose opinions I generally trust, like #link("https://registerspill.thorstenball.com/p/they-all-use-it")[Thorsten Ball] or #link("https://youtu.be/YQnz7L6x068?t=2749")[Mitchell Hashimoto], telling me that it doesn't make sense to work without it.

Of course, it's fine to disagree with people, I don't agree with everything they do all the time, because they have a different set of experiences, and a different reason for doing what they're doing. But it's difficult not to feel like I'm being talked down to for not using these tools, like I'm stuck in the "old ways", and I need to adapt to the "modern world".

There's also been the other side of all this, with people completely rejecting these tools, which I don't really agree with, either. I don't _want_ to reject these tools, I really do want them to be useful, because the less I have to worry about implementations and fixing bugs and stuff, the more time I can spend on coming up with cool ideas. But so far, it just has not been as useful to me as it's been presented.

= Usage

I don't trust AI to give me the right answers for any of the questions I ask it. I pretty much only turn to Claude for help once I've exhausted all my other avenues, at which point it'll either give me an entirely wrong answer and I'll give up, or it'll give me an entirely wrong answer but using a different approach, and I'll go and try that myself. I'm confident enough in my ability to research and find solutions to my problems that if it's something I haven't already found, I doubt the AI is going to find it either.

For things I don't want to do, and I don't really care much if they're right or wrong, I'll happily hand over the reins to AI. I use the Claude built into Zed to write out Python docstrings for me, because I don't really care about them, and I only write them because I have to. I just give it the code, and it writes out all the docstrings in the chat window, which I then copy over to the editor window, making corrections as I go.

I don't use inline completions. I tried out Supermaven at some point last year, but it ended up just getting in my way as I was trying to type things out and use LSP completions. I'm not a fast typer by any means, nor am I a very quick thinker, but it seems like I'm ever so slightly faster than the completions are. I'd wait a little bit for them to come in, and when they didn't I'd start typing, and _that's_ when they'd come in, and completely throw off my flow. After a while of it annoying me, I turned it off.

#note(title: [Newer models])[
  I'm sure you're probably thinking, "Well no wonder you're having a bad time, you're using an old model like Claude, why don't you use [hot new model that just came out] instead?"

  Well, like I said above, my internet is slow enough that it's a bit difficult to download gigabytes of data per model to get it running on my laptop, not to mention that I'd be running it on a _laptop_, not a desktop that's always plugged in and running.

  Aside from that, I don't really feel like making a new account every time a new company comes up with a solution that's 5% better than the previous solutions. I'm trying to get rid of accounts, not make more of them. I'm also not paying money to get more incorrect answers and make zero progress.
]

= Conclusion

Maybe I'm just using AI incorrectly, or maybe my use cases are just weird enough that it can't answer the questions I end up having, but I've generally just found these LLMs to be pretty unhelpful. I already barely use them, to the point where I've kinda forgotten that I even have the option to, because when I do go back and ask them for help with my problem, I'm immediately reminded why I barely use them.

So I think I'm gonna stop, at least for now. I'll keep my Claude account, just in case I need it for something, but until I hear about or see some significant improvements, I don't really see a point in wasting more of my time trying to get it to do something it clearly can't yet.

This post was _not_ written by AI :)
