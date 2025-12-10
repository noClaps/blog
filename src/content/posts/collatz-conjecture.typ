#import "../../pages/post.typ": *

#metadata((
  title: [Collatz Conjecture],
  date: datetime(year: 2022, month: 11, day: 8),
  lastmod: datetime(year: 2025, month: 4, day: 12),
))
#show: post

#quote(
  title: [Jeffery Lagarias, expert on the Collatz conjecture, mathematician at the University of Michigan],
)[
  This is a really dangerous problem. People become obsessed with it and it really is impossible.
]

#quote(
  title: [Paul Erdös, the man who only loved numbers],
)[
  Mathematics is not ready for such problems yet.
]

#quote(
  title: [Master of alliteration, me],
)[
  Many, many mathematicians over the months of meaningless moil have made minimal progress toward the solution of this stupidly simple yet stubbornly unsolvable problem.
]

#quote(
  title: [Pretty much every mathematician ever],
)[
  Don't waste your time on this.
]

So, I wasted my time on this.

= The Problem

So what's this Collatz conjecture thing? Well, if you haven't already watched #link("https://www.youtube.com/watch?v=094y1Z2wpJg")[Veritasium's video] about it, then here's the explanation.

+ Take a positive whole number.
+ If it's even, halve it. If it's odd, multiply it by 3 and add 1.
+ Repeat step 2 until you reach 1.
+ Be confused about what the problem is here.
+ Read explanation below.

The problem here is, we need to find a number that doesn't eventually reach 1 when you continue this sequence. Why? I have no clue, but it's an interesting puzzle nonetheless.

The conjecture suggests that there is no positive whole number that doesn't eventually reach 1. But that hasn't been proved (and probably won't be for a long time), hence why it's still a conjecture and not a theory.

= The Person behind the Problem

#link("https://en.wikipedia.org/wiki/Lothar_Collatz")[Lothar Collatz] (1910-1990) was a German mathematician born in Arnsberg, Westphalia. He is most known for the Collatz conjecture, even though he did so much more.

== AC (Ante conjecture)

Collatz studied at a total of 4 universities before he got his doctorate. Yes, four.

+ University of Greifswald
+ Ludwig Maximilian University of Munich
+ University of Göttingen
+ Humboldt University of Berlin

  - This is where he studied for his doctorate under #link("https://de.wikipedia.org/wiki/Alfred_Klose_(Mathematiker)")[Alfred Klose], a German mathematician who's Wikipedia page is only available in German.
  - Collatz was awarded his doctorate in 1935 for his dissertation _Das Differenzenverfahren mit höherer Approximation für lineare Differentialgleichungen_ (The finite difference method with higher approximation for linear differential equations).

After becoming a non-medical doctor, he worked as an assistant at the University of Berlin, and moved to the Technical University of Karlsruhe later that year.

== The conjecture

Collatz proposed his conjecture in 1937, just 2 years after being awarded his doctorate.

== PC (Post conjecture)

From 1938 to 1943 Collatz was a #link("https://en.wikipedia.org/wiki/Privatdozent")[_Privatdozent_] at Karlsruhe. During the good old days of World War II, he worked with #link("https://en.wikipedia.org/wiki/Alwin_Walther")[Alwin Walther] at the Institute for Practical Mathematics of the Technische Hochschule Darmstadt.

In 1943, he was appointed to professorship at the Technical University of Hanover.

9 years later, in 1952, he moved to the University of Hamburg (the city where the name of hamburgers came from), where, in 1953, he founded the Institute of Applied Mathematics, which is the most original name ever. Collatz worked there until he stopped working, and retired.

Even after retirement, he was still very active on math conferences, and he died from a heart attack while attending one in Varna, Bulgaria in 1990.

== His books

This guy wrote a lot of books. The names are all in German and I'm not gonna list them out here, but here's a list of a few if you want them. I'm sure you can find more online.

#link("https://en.wikipedia.org/wiki/Lothar_Collatz#Selected_works")[Lothar Collatz - Selected works (Wikipedia)]

= Solving the Problem

== The Plan

Back to the topic, how are we gonna solve this problem? We can simplify this problem into 2 expressions:

$
  3x+1
$

$
  x/2
$

Now that we have those, we can turn it into a program to make the computer do all the work for us. I'm gonna be using Python for this, because it's one of the easier programming languages to understand and I'm more comfortable with it. If you have a different preference, feel free to use your own preferred language to write the program.

== The Steps (Python)

Follow these few easy steps and you'll be on your way to solving this problem in no time:

+ Download and install #link("https://www.python.org/")[Python (programming language)]
+ Download and install a code editor. I used #link("https://atom.io/")[Atom] and later IDLE (included with Python, would not recommend using) for this, but you can use any code editor you like. If you use an online one, you may not have to install Python at all.
+ Make a new Python program and type in the following code:

  ```py
  def collatz(n:int): # make collatz function
      while n != 1: # tell code to keep running until it reaches 1
          if n % 2: # if number is odd, multiply by 3 and add 1
              n = n*3 + 1
          else: # else, if number is even, halve it
              n //= 2
          print(n) # output number onto screen

  num = int(input("Enter a number to test: ")) # ask user for number to test
  collatz(num) # run the collatz function with the number you type in
  ```

+ Hit save and double-click the .py file to run it.
+ Enter a number when it tells you to "Enter a number to test: "
+ Wait until the output reaches 1.

Seems simple enough, wouldn't you say?

== The Reality

As you can probably tell, that didn't end up going too well. No matter what number you put in there, it all seems to go to 1 sooner or later. Don't worry, that's a problem that mathematicians of the world have been dealing with for the last 84 years (as of 2021).

As for my code, I'm sure there's a much better way to do this than what I've written. You can find those online, but I made this program myself, and I'm (kinda) happy with it. There's probably also a way to automate this so that it tests all the numbers for you, but I liked the idea of being able to try your own numbers to see if they work or not.

But, if the idea of spending your lifetime trying bajillions of numbers manually in this program sounds appealing to you, then you really need something exciting in your life, buddy. But other than that, go ahead, give this problem a try. Maybe if you try for long enough, you might find yourself an answer.

== The "Solution"

So far, there's been no solutions. That's not really a conclusion since it can't be proven that there's no solution. Just like how it can't be proven that there _is_ a solution.

#link("https://en.wikipedia.org/wiki/Terence_Tao")[Terence Tao], kid genius who's no longer a kid but still a genius, gave this problem a go. He found a "solution", which is that _almost_ all numbers reach 1, which gives us a pretty good estimate of the actual solution. You can read about it in his #link("https://terrytao.wordpress.com/2011/08/25/the-collatz-conjecture-littlewood-offord-theory-and-powers-of-2-and-3/")[blog post]. I didn't understand any of it, but maybe you will.

#quote(
  title: [Terence Tao, genius, mathematician],
)[
  It’s actually an occupational hazard when you’re a mathematician. You could get obsessed with these big famous problems that are way beyond anyone’s ability to touch, and you can waste a lot of time.
]

I found a thesis by Jose William Porras that claims to be the "Solution to Collatz's Conjecture". You can #link("https://www.researchgate.net/publication/325389892_Solution_to_Collatz's_Conjecture")[have a read here]. Again, I didn't understand it, but maybe you will.

= Sources and Links

#link("https://www.wikidata.org/wiki/Property:P69")[List of universities attended by Lothar Collatz]

#link(
  "https://www.quantamagazine.org/mathematician-proves-huge-result-on-dangerous-problem-20191211/",
)[Simpler explanation of Terence Tao's "solution"]

#link("https://en.wikipedia.org/wiki/Collatz_conjecture")[Collatz conjecture Wikipedia page]

#link("https://mathshistory.st-andrews.ac.uk/Biographies/Collatz/")[Lother Collatz biography]

#link(
  "https://www.youtube.com/playlist?list=PLPa2dwCo_Eqker6ktrUs7dC7FkKwa7Q2h",
)[YouTube playlist about Collatz conjecture (includes Veritasium video)]

*All other sources are linked in the main text*
