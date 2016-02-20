# Chapter 1: What ever are we doing?

## Introductions

Hi! I'm Professor Franklin Risby. Pleased to make your acquaintance. We'll be spending some time together, as I'm supposed to teach you a bit about functional programming. But enough about me, what about you? I'm hoping you're familiar with the JavaScript language, have a teensy bit of Object-Oriented experience, and fancy yourself a working class programmer. You don't need to have a Ph.D in Entomology, you just need to know how to find and kill some bugs.

I won't assume any previous functional programming knowledge, because we both know what happens when you assume. I will, however, expect you to have run into some of the unfavorable situations that arise from working with mutable state, unrestricted side effects, and unprincipled design. Now that we've been properly introduced, let's get on with it.

The purpose of this chapter is to give you a feel for what we're after when we write functional programs. We must have some idea about what makes a program *functional* or we'll find ourselves scribbling aimlessly, avoiding objects at all costs - a clumsy endeavor indeed. We need a bullseye to hurl our code toward, some celestial compass for when the waters get rough.

Now, there are some general programming principles - various acronymic credos that guide us through the dark tunnels of any application: DRY (don't repeat yourself), YAGNI (ya ain't gonna need it), loose coupling high cohesion, principle of least surprise, single responsibility, and so on.

I won't belabor listing each and every guideline I've heard throughout the years... the point is that they hold up in a functional setting, though they're merely tangential to our goal. What I'd like you to get a feel for now, before we get any further, is our intention when we poke and prod at the keyboard; our functional Xanadu.

<!--BREAK-->

## A brief encounter

Let's start with a touch of insanity. Here is a seagull application. When flocks conjoin they become a larger flock, and when they breed, they increase by the number of seagulls with whom they're breeding. Now, this is not intended to be good Object-Oriented code, mind you, it is here to highlight the perils of our modern, assignment based approach. Behold:

```js
var Flock = function(n) {
  this.seagulls = n;
};

Flock.prototype.conjoin = function(other) {
  this.seagulls += other.seagulls;
  return this;
};

Flock.prototype.breed = function(other) {
  this.seagulls = this.seagulls * other.seagulls;
  return this;
};

var flock_a = new Flock(4);
var flock_b = new Flock(2);
var flock_c = new Flock(0);

var result = flock_a.conjoin(flock_c)
    .breed(flock_b).conjoin(flock_a.breed(flock_b)).seagulls;
//=> 32
```

Who on earth would craft such a ghastly abomination? It is unreasonably difficult to keep track of the mutating internal state. And, good heavens, the answer is even incorrect! It should have been `16`, but `flock_a` wound up permanently altered in the process. Poor `flock_a`. This is anarchy in the I.T.! This is wild animal arithmetic!

If you don't understand this program, it's okay, neither do I. The point is that state and mutable values are hard to follow, even in such a small example.

Let's try again with a more functional approach:

```js
var conjoin = function(flock_x, flock_y) { return flock_x + flock_y; };
var breed = function(flock_x, flock_y) { return flock_x * flock_y; };

var flock_a = 4;
var flock_b = 2;
var flock_c = 0;

var result = conjoin(
  breed(flock_b, conjoin(flock_a, flock_c)), breed(flock_a, flock_b)
);
//=>16
```

Well, we got the right answer this time. There's much less code. The function nesting is a tad confusing...(we'll remedy this situation in ch5). It's better, but let's dig deeper. There are benefits to calling a spade a spade. Had we done so, we might have seen we're just working with simple addition (`conjoin`) and multiplication (`breed`).

There's really nothing special at all about these two functions other than their names. Let's rename our custom functions to reveal their true identity.

```js
var add = function(x, y) { return x + y; };
var multiply = function(x, y) { return x * y; };

var flock_a = 4;
var flock_b = 2;
var flock_c = 0;

var result = add(
  multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b)
);
//=>16
```
And with that, we gain the knowledge of the ancients:

```js
// associative
add(add(x, y), z) === add(x, add(y, z));

// commutative
add(x, y) === add(y, x);

// identity
add(x, 0) === x;

// distributive
multiply(x, add(y,z)) === add(multiply(x, y), multiply(x, z));
```

Ah yes, those old faithful mathematical properties should come in handy. Don't worry if you didn't know them right off the top of your head. For a lot of us, it's been a while since we've reviewed this information. Let's see if we can use these properties to simplify our little seagull program.

```js
// Original line
add(multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b));

// Apply the identity property to remove the extra add
// (add(flock_a, flock_c) == flock_a)
add(multiply(flock_b, flock_a), multiply(flock_a, flock_b));

// Apply distributive property to achieve our result
multiply(flock_b, add(flock_a, flock_a));
```

Brilliant! We didn't have to write a lick of custom code other than our calling function. We include `add` and `multiply` definitions here for completeness, but there is really no need to write them - we surely have an `add` and `multiply` provided by some previously written library.

You may be thinking "how very strawman of you to put such a mathy example up front". Or "real programs are not this simple and cannot be reasoned about in such a way". I've chosen this example because most of us already know about addition and multiplication so it's easy to see how math can be of use to us here.

Don't despair - throughout this book, we'll sprinkle in some category theory, set theory, and lambda calculus to write real world examples that achieve the same simplicity and results as our flock of seagulls example. You needn't be a mathematician either. It will feel just like using a normal framework or API.

It may come as a surprise to hear that we can write full, everyday applications along the lines of the functional analog above. Programs that have sound properties. Programs that are terse, yet easy to reason about. Programs that don't reinvent the wheel at every turn. Lawlessness is good if you're a criminal, but in this book, we'll want to acknowledge and obey the laws of math.

We'll want to use the theory where every piece tends to fit together so politely. We'll want to represent our specific problem in terms of generic, composable bits and then exploit their properties for our own selfish benefit. It will take a bit more discipline than the "anything goes" approach of imperative programming (we'll go over the precise definition of imperative later in the book, but for now it's anything other than functional programming), but the payoff of working within a principled, mathematical framework will astound you.

We've seen a flicker of our functional north star, but there are a few concrete concepts to grasp before we can really begin our journey.

[Chapter 2: First Class Functions](ch2.md)
