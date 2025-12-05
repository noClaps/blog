#let title = [Floats]
#let date = datetime(year: 2025, month: 11, day: 27)

Long story short, I got really bored over the summer and made a new floating point format.

Before we get into that, let's dive a little deeper into how computers store data to understand what I'm even talking about here.

= How computers store data

As I'm sure you probably know by now, computers can only read and write 0s and 1s, in a format known as "binary". In fact, that's what a "bit" is, a "*b*inary dig*it*". This works out conveniently for storing integers, since any integer can be converted into binary by simply dividing by two and taking the remainders. For example, to convert 25 into binary:

$
  25 & -> 25 div 2 = 12 "remainder" 1 \
  12 & -> 12 div 2 = 6 "remainder" 0 \
   6 & -> 6 div 2 = 3 "remainder" 0 \
   3 & -> 3 div 2 = 1 "remainder" 1 \
   1 & -> 1 div 2 = 0 "remainder" 1
$

So, 25 is `11001` in binary. Similarly, we can convert any binary number to the equivalent number in decimal by multiplying each bit by its corresponding power of 2:

$
        & 1   &   & 1   &   & 0   &   & 0   &   & 1 \
  times & 2^4 &   & 2^3 &   & 2^2 &   & 2^1 &   & 2^0 \
      = & 16  & + & 8   & + & 0   & + & 0   & + & 1 \
      = & 25
$

We can also encode letters and symbols (like emojis 🍪) by converting each symbol to be represented by one specific integer. As long as everyone agrees on what integers correspond to what symbols, text I write on my computer can be displayed on your screen! This agreement is #link("https://home.unicode.org/")[Unicode], and there are a few different encodings for it, but the core idea is the same. #link("https://evanhahn.com/longhornphp2025/")[Evan Hanh's talk] at Longhorn PHP is an excellent resource for understanding how Unicode works.

= Floating point numbers

While we can store most things as integers, there's still some things that we can't convert as easily. For example, how would you write $1/2$ as an integer? This was kind of a problem, since there are a _lot_ of these types of numbers, and if we tried assigning each one to an integer, we'd run out of room real quick.

To solve this problem, the Institute of Electrical and Electronics Engineers (IEEE) came up with a convention to represent these types of "floating point" numbers in binary. Keep in mind that these are still just 0s and 1s inside, only the way that we read them has changed.

I'll use the 64-bit version since most people nowadays have 64-bit computers, but just know that there are other equivalent formats for 16, 32 and 128 bits.

Given 64 bits, going from left to right, we can split them up into different sections:

- The first bit can be the "sign" bit. If the sign bit is 1, then the number is negative, otherwise it's positive.

- The next 11 bits can be "exponent" bits.

- The final 52 bits can be "significand" or "mantissa" bits.

== Scientific notation

The way this format works is that it utilises a modified version of scientific notation. If you're unfamiliar with scientific notation, it's a slightly different way of writing numbers, mainly used in science and engineering fields. Here's what 25 would look like in scientific notation:

$
  25 = 2.5 times 10^1
$

The basic idea is that it's some value between 1 and 10 (or -1 and -10 for negative numbers), multiplied by 10 to some power. A key benefit of this is that it's very easy to write and compare really big numbers or really small numbers. For instance, the (approximate) speed of light can be written as a normal integer:

$
  300,000,000 "m/s"
$

or in scientific notation:

$
  3 times 10^8 "m/s"
$

See how much cleaner the second one looks?

== Binary scientific notation

The floating point format works similarly, except it uses a base of 2, instead of a base of 10. This means that the "some value" part only needs to be between 1 and 2 (or -1 and -2 for negative numbers). Similar to how we could write numbers in base 10 scientific notation, we can write numbers in base 2 scientific notation:

$
  25 = 1.5625 times 2^4
$

Now, we have a way to split up our number into the different parts that we listed above.

- The sign, let's call it $s$, is 0 here, since our number is positive.

- The exponent, let's call it $e$, is 4.

- The mantissa, let's call it $m$, is 0.5625.

Thus, we can represent our number as:

$
  (-1)^s times (1 + m) times 2^e
$

You might be thinking, "hold on, how are we supposed to write 0.5625 in binary?" Well, you'd write it just like you write decimal numbers in base 10! Each digit after the decimal point is that number times 10 raised to a negative power, for example, $0.5 = 5 times 10^(-1)$ (told you scientific notation is useful). Similarly, we can raise bits to negative powers too, for example, $0.5 = 1 times 2^(-1)$, so 0.5 in base 10 is 0.1 in base 2!

Using all of this, we can write 25 in our floating point format as:

$
  mat(
    delim: #none,
    0, 10000000011, 1001000000000000000000000000000000000000000000000000;
    0, 4, 0.5625;
    "sign", "exponent", "mantissa"
  )
$

There are a lot of additional details about the floating point format that I won't go into here, because it's not really relevant to the main point of this post. There's a #link("https://ciechanow.ski/exposing-floating-point/")[great blog post] by Bartosz Ciechanowski going over how floating point works in much more detail, and if you had any questions, chances are that the answer is in that post. Ciechanowski also made #link("https://float.exposed")[Float Exposed], which gives you a more interactive way to understand how floats work.

Nowadays, nearly all CPUs and GPUs support this floating point format in their built-in instructions. If you've ever heard the term "flops" when talking about processor speed, that's short for *fl*oating point *op*eration per s*econd.

However, despite its ubiquity, there's one big drawback to the format: precision.

== Precision

Scientific notation, and by extension floating point, has a big problem: you can really only express numbers that are some power of your base. For example, in base 10 scientific notation, you can't really express $1/3$ accurately, at least without some fancy syntax like:

$
  1/3 = 3.overline(3) times 10^(-1)
$

This equals 0 point 3 repeating, so $0.333333...$. You can represent numbers this way in base 2 as well:

$
  1/3 = 1.overline(01) times 2^(-2)
$

However, computers don't have the luxury of infinitely repeating values, since they need to store their values in a finite number of bits, so they round off after a certain point. While this is fine for most use cases, it's not perfectly precise, and you end up with things like:

```py
>>> 0.1 + 0.2
0.30000000000000004
```

And this brings me to my new, probably very impractical, number format.

= Arbitrary base floating point

My arbitrary base floating point format works very similarly to the existing floating point format, in that it uses scientific notation to represent numbers, but with one key difference: you can customise the base. You have:

- 1 sign bit ($s$)

- 8 exponent bits ($e$)

- 8 base bits ($b$)

- 47 mantissa bits ($m$)

which you can combine into a number using:

$
  (-1)^s times b^e times m
$

This key innovation lets you represent nearly any rational number. For example, to write $1/3$:

$
  1/3 = (-1)^0 times 3^(-1) times 1
$

I am well aware that this format is impractical for various different reasons. For instance, there are simply far too many ways to represent any single number, meaning that any kind of arithmetic would be incredibly difficult to implement.

$
    & 1/3 & = (-1)^0 times 3^(-1) times 1 \
  = & 2/6 & = (-1)^0 times 6^(-1) times 2 \
  = & 3/9 & = (-1)^0 times 9^(-1) times 3 \
  = & ...
$

All of these have different bit representations:

```
1/3 = 0 01111110 00000011 00000000000000000000000000000000000000000000001
2/6 = 0 01111110 00000110 00000000000000000000000000000000000000000000010
3/9 = 0 01111110 00001001 00000000000000000000000000000000000000000000011
```

which makes them incompatible with each other. On top of this, numbers like $1/3$ and $1/7$ would be even more incompatible since they operate in different bases ($1/3 = 1 times 3^(-1)$ and $1/7 = 1 times 7^(-1)$), and trying to add or multiply them together would probably be a nightmare to implement in CPU and GPU circuitry, or even in code.

There's also a big advantage to using base-2 floating point over an arbitrary base or any other base, which is that, since computers work in bits, you can do some incredibly fast manipulations and calculations using bit operations that aren't possible with any other base.

But like I said at the beginning, I got bored over the summer and came up with this, and I wanted to write it out because I thought it was a cool idea, regardless of how impractical it might be. I've learned a lot about how the floating point format works over the course of writing this post, as well as a bit about how computers store text, all of which I've added links to above. Honestly, even if that's all you take away from this, I'm pretty happy with that, have a cookie 🍪.
