#let title = [Po-Shen Loh Quadratic Method]
#let date = datetime(year: 2025, month: 4, day: 12)

I found out about the Po-Shen Loh method of solving quadratic equations a few years ago, and I've been meaning to write a post about it since, and only just got around to it.

You can read the #link("https://www.poshenloh.com/quadraticdetail/")[original blog post] by Dr Loh, which goes into the math behind the method. I'll cover some of that math here too, as well as a code implementation of the method.

= Method

Say we start with a quadratic equation:

$
  x^2 + b x + c = 0
$

where $a$, $b$ and $c$ are real numbers. We want to factorise this into the form:

$
  (x - r_1)(x - r_2) = 0
$

where $r_1$ and $r_2$ are also real numbers, known as the _roots_ of the quadratic. These are essentially points where, if the equation was plotted, the graph would cross the $x$-axis.

The standard method for solving quadratics is using a formula that we've all learned in school:

$
  x = (-b plus.minus sqrt(b^2 - 4 a c))/(2a)
$

which gives us two values for $x$, where plugging them into the original quadratic equation would give us 0. These are the two roots, $r_1$ and $r_2$.

However, let's try expanding our factorised equation back into the quadratic form:

$
             (x - r_1)(x - r_2) & = 0 \
  x^2 - r_2 x - r_1 x + r_1 r_2 & = 0 \
   x^2 - (r_1 + r_2)x + r_1 r_2 & = 0
$

We can see that $-b = r_1 + r_2$ and $c = r_1 r_2$. Now, we could try to guess which values for $r_1$ and $r_2$ fit for these constraints, which works for some simple quadratic equations with integer roots, but gets complicated to do for non-integer roots.

Instead, we can realise that $r_1, r_2 = -b/2 plus.minus u$ for some real number $u$. This is basically like saying that since $r_1$ and $r_2$ add up to $-b$, $-b/2}$ must be exactly in between them, and we can simply add or subtract a value $u$ to get to $r_1$ and $r_2$. For example, if we have $r_1=3$ and $r_2=5$, then $-b=r_1+r_2=3+5=8$. From this, we can see that $-b/2 = 4$, and we can simply add and subtract $u=1$ to get back $r_1=3$ and $r_2=5$.

Next, we can see that $c = r_1 r_2$. Since we already know that $r_1 = -b/2+u$ and $r_2 = -b/2-u$, we can simply multiply them together to get $c$:

$
  c & = r_1 r_2 \
    & = (-b/2 + u) (-b/2 - u) \
    & = (b^2)/4 - u^2
$

The third line leads from $(a+b)(a-b)=a^2-b^2$. Since the values of $b$ and $c$ are already known from the original quadratic equation, we can simply rearrange this equation to get the value of $u$:

$
    c & = (b^2)/4 - u^2 \
  u^2 & = (b^2)/4 - c \
    u & = sqrt((b^2)/4 - c)
$

Finally, we can plug in this value into our previous equations for $r_1$ and $r_2$:

$
  r_1 & = -b/2 + sqrt((b^2)/4 - c) \
  r_2 & = -b/2 - sqrt((b^2)/4 - c)
$

Now you might be thinking, "well this is all great, but what if we have a coefficient in front of the $x^2$ term?". Great question, let's see what happens! We start with:

$
  a x^2 + b x + c = 0
$

where, again, $a$, $b$ and $c$ are all real numbers. All we need to do to apply our previous method is to divide the entire equation by $a$:

$
  x^2 + b/a x + c/a = 0
$

If we plug in our new values of $b' = b/a$ and $c' = c/a$ into the equation for our roots from earlier, we get:

$
  r_1 & = -b'/2 + sqrt(((b')^2)/4 - c') \
      & = -b/(2a) + sqrt((b^2)/(4a^2) - c/a) \
      & = -b/(2a) + sqrt((b^2 - 4 a c)/(4a^2)) \
      & = -b/(2a) + sqrt(b^2 - 4 a c)/(2a) \
      & = (-b + sqrt(b^2 - 4 a c))/(2a) \
  r_2 & = (-b - sqrt(b^2 - 4 a c))/(2a)
$

Seem familiar? These are the roots given by the original quadratic formula. If you were wondering where the formula comes from, this is it.

Why do it using this method then? I think the logical steps that lead to the roots using the Po-Shen Loh method are much more intuitive and easy to work with than trying to remember the quadratic formula, especially for someone who's just learning about quadratics or doesn't use them often enough to have it burned into their memory.

= Code implementation

The algorithm above shouldn't be too difficult to implement yourself if you have even a little bit of coding knowledge, since it's mainly just additions, multiplications and square roots. I've written a short implementation of the algorithm in C, but you can translate the code into whatever other language you'd like.

```c
#include <math.h>
#include <stdio.h>

int main() {
  // Enter your values for the coefficients a, b and c in ax²+bx+c=0
  double a = 1;
  double b = 2;
  double c = 1;

  // Calculate b' and c'
  double b_prime = b / a;
  double c_prime = c / a;

  // Calculate u = √(b'²/4 - c')
  double u = sqrt((b_prime * b_prime) / 4 - c_prime);

  // Calculate the two roots
  double r1 = -b_prime / 2 + u;
  double r2 = -b_prime / 2 - u;

  printf("r1 = %f\n"
         "r2 = %f\n",
         r1, r2);
}
```

While this code doesn't handle it, the Po-Shen Loh method can also be used to handle complex roots. You can do this in C, but it'll be easier to do in a language that has a built-in complex number type like Go or Python.
