---
title: Random Numbers
date: 2025-07-23
---

## Every day I'm shufflin'

Spotify launched in 2010 with a feature to let you shuffle your songs, allowing you to play them in a random order. This used an algorithm called the [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).

::: quote Cynthia Teeters, <code>cynthiateeters/fisher-yates</code> {href="https://github.com/cynthiateeters/fisher-yates"}
The modern version of the Fisher-Yates shuffle works as follows:

1. Start from the last element of the array (index n-1)
2. Generate a random index j between 0 and i (inclusive)
3. Swap the elements at positions i and j
4. Move to the previous element (i-1)
5. Repeat steps 2-4 until you reach the beginning of the array

\[...]

```ts
function fisherYatesShuffle(array) {
  // Create a copy to avoid modifying the original
  const arrayCopy = [...array];

  // Fisher-Yates algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }

  return arrayCopy;
}
```
:::

However, they had a problem: people were complaining that [their](https://www.reddit.com/r/spotify/comments/1o0j86/whats_with_shuffle_seems_kinda_terrible/) [random](https://www.reddit.com/r/AskReddit/comments/m9b90/is_it_just_me_or_is_the_shuffle_option_in_most/) [shuffle](https://www.reddit.com/r/spotify/comments/1vrwen/been_an_issue_for_years_when_will_shuffle_be_fixed/) [wasn't](https://www.reddit.com/r/spotify/comments/qseo9/how_does_spotify_shuffle/) [very](https://community.spotify.com/t5/iOS-iPhone-iPad/Shuffle-play-is-not-random/td-p/632802) [random](https://community.spotify.com/t5/Android/Shuffle-feature-seems-to-favor-certain-songs/td-p/414046). Of course, the problem wasn't that Shuffle wasn't random, it's that human brains are incredibly good at catching and coming up with patterns, and so very bad at randomness.

## Randomness is unintuitive

For instance, say you have a bucket with the numbers 1–9, and you randomly pick out a number, write down what it is, and put it back in. Repeat this 10 times, and you'll have yourself a random 10-digit number. Now if you'd written down `1826421937`, you'd think, "Well that looks pretty random to me!". On the other hand, if you'd written `1111111111`, you'd start to get suspicious.

But really `1111111111` is just as likely as `1826421937`! How? Well, let's break it down mathematically. Say you have a set of numbers that you're choosing from:

$$
\mathcal{N} = \{1, 2, 3, 4, 5, 6, 7, 8, 9\}
$$

The size of $$\mathcal{N}$$ is 9, and each number you pull is equally likely, meaning the probability of pulling a number $$n$$ out of set $$\mathcal{N}$$ is:

$$
\text{Prob}(n) = \frac{1}{9}
$$

When you want to calculate the probability of event A _and_ event B happening, you multiply their probabilities together. So if we want to calculate the probability of getting $$n_1$$ _and_ $$n_2$$ out of our set:

$$
\text{Prob}(n_1 \text{ and } n_2) = \frac{1}{9} \times \frac{1}{9} = {\left( \frac{1}{9} \right)}^{2}
$$

We can continue doing this until we reach 10 numbers:

$$
\text{Prob}(n_1 \text{ and } n_2 \text{ and } \dots \text{ and } n_10) = {\left( \frac{1}{9} \right)}^{10}
$$

Note that each number was chosen independently and randomly, which means that each number independently had an equal probability of being anything from the set $$\mathcal{N}$$, that is, the numbers 1–9. This means that a sequence like `1111111111` is equally as probable as `1826421937`, because we never specified what $$n_{1 \dots 10}$$ are.

Going back to Spotify, this means that if you have 3 songs in your playlist from artist A, 5 from artist B and 2 from artist C, and you shuffle play, the probability of getting `AAABBBBBCC` is equal to the probability of getting `ABCABCBAB`, but to humans, the latter _feels_ more random than the former.

## Computers aren't random

Turns out, computers aren't good at random numbers either! A computer is, at its core, a deterministic machine. You put the same input in, you get the same output out. However, this contradicts the goal of most random number generators, which is to be, well, random, and therefore non-deterministic.

So instead of _true_ random number generation, computers use _pseudo_ random number generation, which mimics the statistical behavior of true random number generation, such that each element in the set of outputs has a roughly equal chance of appearing. There are many algorithms to do this, ranging from relatively simple ones like the [Linear Congruential Generator (LCG)](https://en.wikipedia.org/wiki/Linear_congruential_generator):

```ts
// original function from: https://stackoverflow.com/a/3062783
// values of A, C and M from: https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use

const A = 8121
const C = 28411
const M = 134456

let seed = 123456789

function LCG() {
  seed = (A * seed + C) % M;
  return seed;
}
```

to far more complex ones like the [PCG family of random number generators](https://www.pcg-random.org/). Most random number generators have an input called the "seed", which uses the pseudo-random nature of algorithmic random number generators to be able to specify a certain output from an input. This allows the outputs to be repeatable, which can be useful in places like procedurally generated games where you want the ability to recreate a world by remembering its seed.

::: quote Rune Skovbo Johansen, Unity {href="https://unity.com/blog/engine-platform/primer-on-repeatable-random-numbers"}
Why would you want to repeat the same result more than once?

- Ability to revisit the same level/world. For example a certain level/world can be created from a specific seed. If the same seed is used again, you will get the same level/world again. You can for example do this in Minecraft.
- Persistent world that's generated on the fly. If you have a world that's generated on the fly as the player moves around in it, you may want locations to remain the same the first and subsequent times the player visit those locations (like in Minecraft, the upcoming game No Man's Sky, and others), rather than being different each time as if driven by dream logic.
- Same world for everyone. Maybe you want your game world to be the same for everyone who play it, exactly as if it wasn't procedurally generated. This is for example the case in No Man's Sky. This is essentially the same as the ability to revisit the same level/world mentioned above, except that the same seed is always used.
:::

This seed can be anything — a number, a bit of text, some binary data, etc., it's just some input to the function. By setting the known initial state you can generate a known sequence of numbers simply by calling the function over and over again.

For the LCG example above, we set the seed to `123456789`, so if we call the function 10 times now and tomorrow, its outputs will be exactly the same. Running the program below will always give the same output, regardless of when you run it:

```ts
const A = 8121
const C = 28411
const M = 134456

let seed = 123456789

function LCG() {
  seed = (A * seed + C) % M;
  return seed;
}

console.log(LCG())
console.log(LCG())
console.log(LCG())
console.log(LCG())
console.log(LCG())
console.log(LCG())
console.log(LCG())
console.log(LCG())
console.log(LCG())
console.log(LCG())
```

Some implementations of random number generators default to setting the seed to your system time. This introduces an additional level of "randomness", since now the outputs are dependent on your computer's clock, meaning each time you run the function you'll get a different output:

```ts
function TimeBasedRNG() {
  let seed = Date.now()

  return RNG(seed) // for some random number generator
}
```

Of course, you can still manipulate this by stopping your computer's clock, or giving the program a fixed value for the time.

## Cryptography

As we saw above, a lot of common pseudo-random number generators are not too difficult to reverse-engineer. However, a lot of cryptography requires secure random number generation that is very difficult to predict, since it's used to generate things like encryption keys which keep your data safe.

This is where [cryptographically secure pseudo-random number generators (CSPRNG)](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator) are useful. The way they work is essentially the same as regular pseudo-random number generators, but their algorithms are much more complex and difficult to predict, making them more suitable for situations where a higher degree of "randomness" is needed, at the cost of being slower to compute.

::: quote Joshua Liebow-Feeser, Cloudflare {href="https://blog.cloudflare.com/randomness-101-lavarand-in-production/"}
As we’ve [discussed in the past](https://blog.cloudflare.com/why-randomness-matters/), cryptography relies on the ability to generate random numbers that are both unpredictable and kept secret from any adversary.

But “random” is a pretty tricky term; it’s used in many different fields to mean slightly different things. And like all of those fields, its use in cryptography is very precise. In some fields, a process is random simply if it has the right statistical properties. For example, the digits of pi are said to be random because all sequences of numbers appear with equal frequency (“15” appears as frequently as “38”, “426” appears as frequently as “297”, etc). But for cryptography, this isn’t enough - random numbers must be _unpredictable_.

\[...]

CSPRNGs are algorithms which, provided an input which is itself unpredictable, produce a much larger stream of output which is also unpredictable. This stream can be extended indefinitely, producing as much output as required at any time in the future. In other words, if you were to flip a coin a number of times (a process which is known to be unpredictable) and then use the output of those coin flips as the input to a CSPRNG, an adversary who wasn’t able to predict the output of those coin flips would also be unable to predict the output of the CSPRNG - no matter how much output was consumed from the CSPRNG.
:::

Of course, computers are still deterministic machines, but a CSPRNG needs to be unpredictable, so where do we get that unpredictability from? The real world, of course! Techniques like timing keystrokes with very high precision, reading temperature from the CPU, and measuring data from other sensors like accelerometers and gyroscopes can yield incredibly unpredictable values, because those conditions are really difficult to recreate reliably.

While it's probably enough to use just one of those sources, many implementations of CSPRNGs actually use multiple of them, because `unpredictable source A + unpredicable source B = really really unpredictable output`. Besides, if there's a chance that one of those sources was actually not as random as previously thought, the other sources will more than make up for it.

### Cloudflare LavaRand

One of the more famous examples of using the real world for randomness is [LavaRand at Cloudflare](https://blog.cloudflare.com/lavarand-in-production-the-nitty-gritty-technical-details/). There's even a [Tom Scott video](https://www.youtube.com/watch?v=1cUUfMeOijg) about it!

![The view of the wall of lava lamps from the camera. Source: [LavaRand in Production: The Nitty-Gritty Technical Details](https://blog.cloudflare.com/lavarand-in-production-the-nitty-gritty-technical-details/).](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/1thY8qByl6CmiTCI9tIgOG/5de49269d8aeae96359870cad09d3a16/lava-lamps-camera.jpg)

LavaRand is a wall of lava lamps at Cloudflare's San Francisco office, with a camera pointed at it. Because computers store images as bits, the image can effectively be converted into a number, and that number can be used as a seed for a random number generator. The camera periodically takes pictures of the wall and uses it as the seed for a CSPRNG. There's a lot of sources of entropy (randomness) throughout the system, which just adds to the overall unpredictability of the system.

![The flow of entropy in LavaRand. Source: [LavaRand in Production: The Nitty-Gritty Technical Details](https://blog.cloudflare.com/lavarand-in-production-the-nitty-gritty-technical-details/).](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/HQnazwt1tj0ywVtjZ0HTX/4cbe7db55b4792b1b86dcea4a57b5474/Screen-Shot-2017-10-31-at-3.57.19-PM.png)

::: note
Cloudflare wasn't actually the first company to come up with this system. The [original Lavarand system](https://en.wikipedia.org/wiki/Lavarand) was designed and [patented](https://patents.google.com/patent/US5732138) by Silicon Graphics in 1996. The patent expired in 2016, and Cloudflare's LavaRand system was launched in 2017.
:::

## Spotify's solution

So, how did Spotify solve their problem? They made their algorithm _less_ random! As we saw earlier, humans are pretty good at seeing patterns even when there aren't any, so really the only way to combat that is a pattern that _seems_ random to humans, but is carefully crafted that way.

Taking inspiration from the algorithms in [The art of shuffling music](https://keyj.emphy.de/balanced-shuffle/) by Martin Fiedler, and dithering algorithms, Spotify designed their own algorithm for shuffle.

The way it works is that they take all of the songs in your playlist and separate them by artist. Then, they create a timeline, and try to spread the songs by each artist evenly across the timeline, and once that's been done for all the artists, they merge together the songs as best they can, giving a seemingly random output.

::: quote How to shuffle songs? — Lukáš Poláček, Spotify {href="https://web.archive.org/web/20240813071829/https://engineering.atspotify.com/2014/02/how-to-shuffle-songs/"}
We can take inspiration from the dithering algorithms to solve our problem with clusters of songs by the same artist; we will try to spread them throughout the whole playlist. Suppose we have a playlist containing some songs by **The White Stripes**, **The xx**, **Bonobo**, **Britney Spears** ([Toxic](https://open.spotify.com/track/26nr9XnFCYWxBTIP7HyWXg)!) and **Jaga Jazzist**. For each artist we take their songs and try to stretch them as evenly as possible along the whole playlist. Then we collect all songs and order them by their position.
:::

![Spotify's merge algorithm for shuffle. The circles are songs, and the colors represent the different artists. As you can see at the bottom, the final output looks fairly random. Source: [How to shuffle songs?](https://web.archive.org/web/20240813071829/https://engineering.atspotify.com/2014/02/how-to-shuffle-songs/) (Internet Archive link).](./spotify-merge-algorithm.png)

This algorithm has been in use since 2014, and while there are still complaints about how Spotify's shuffle isn't random, I think it's a really clever solution to a pretty difficult problem.
