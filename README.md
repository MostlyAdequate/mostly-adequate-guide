<img src="images/cover.png"/>

# About this book

This is a book on the functional paradigm in general. We'll use the world's most popular functional programming language: JavaScript. Some may feel this is a poor choice as it's against the grain of the current culture which, at the moment, feels predominately imperative. However, I believe it is the best way to learn FP for several reasons:

 * You likely use it every day at work.

    This makes it possible to practice and apply your acquired knowledge each day on real world programs rather than pet projects on nights and weekends in an esoteric FP language.


 * We don't have to learn everything up front to start writing programs.

    In a pure functional language, you cannot log a variable or read a DOM node without using monads. Here we can cheat a little as we learn to purify our codebase. It's also easier to get started in this language since it's mixed paradigm and you can fall back on your current practices while there are gaps in your knowledge.


 * The language is fully capable of writing top notch functional code.

    We have all the features we need to mimic a language like Scala or Haskell with the help of a tiny library or two. Object-oriented programming currently dominates the industry, but it's clearly awkward in JavaScript. It's akin to camping off of a highway or tap dancing in galoshes. We have to `bind` all over the place lest `this` change out from under us, we don't have classes[^Yet], we have various work arounds for the quirky behavior when the `new` keyword is forgotten, private members are only available via closures. To a lot of us, FP feels more natural anyways.

That said, typed functional languages will, without a doubt, be the best place to code in the style presented by this book. JavaScript will be our means of learning a paradigm, where you apply it is up to you. Luckily, the interfaces are mathematical and, as such, ubiquitous. You'll find yourself at home with swiftz, scalaz, haskell, purescript, and other mathematically inclined environments.


# Gitbook (for a better reading experience)

http://drboolean.gitbooks.io/mostly-adequate-guide/

### EPUB

https://www.gitbook.com/download/epub/book/drboolean/mostly-adequate-guide

### Mobi (Kindle)

https://www.gitbook.com/download/mobi/book/drboolean/mostly-adequate-guide

### Do it yourself

```
git clone https://github.com/DrBoolean/mostly-adequate-guide.git

cd mostly-adequate-guide/
npm install gitbook-cli -g
gitbook init

brew update
brew cask install calibre

gitbook mobi . ./functional.mobi
```

# Other Languages

* [中文版](https://github.com/llh911001/mostly-adequate-guide-chinese)


# Table of Contents

## Part 1

* [Chapter 1: What ever are we doing?](ch1.md)
  * [Introductions](ch1.md#introductions)
  * [A brief encounter](ch1.md#a-brief-encounter)
* [Chapter 2: First Class Functions](ch2.md)
  * [A quick review](ch2.md#a-quick-review)
  * [Why favor first class?](ch2.md#why-favor-first-class)
* [Chapter 3: Pure Happiness with Pure Functions](ch3.md)
  * [Oh to be pure again](ch3.md#oh-to-be-pure-again)
  * [Side effects may include...](ch3.md#side-effects-may-include)
  * [8th grade math](ch3.md#8th-grade-math)
  * [The case for purity](ch3.md#the-case-for-purity)
  * [In Summary](ch3.md#in-summary)
* [Chapter 4: Currying](ch4.md)
  * [Can't live if livin' is without you](ch4.md#cant-live-if-livin-is-without-you)
  * [More than a pun / Special sauce](ch4.md#more-than-a-pun--special-sauce)
  * [In Summary](ch4.md#in-summary)
* [Chapter 5: Coding by Composing](ch5.md)
  * [Functional Husbandry](ch5.md#functional-husbandry)
  * [Pointfree](ch5.md#pointfree)
  * [Debugging](ch5.md#debugging)
  * [Category Theory](ch5.md#category-theory)
  * [In Summary](ch5.md#in-summary)
* [Chapter 6: Example Application](ch6.md)
  * [Declarative Coding](ch6.md#declarative-coding)
  * [A flickr of functional programming](ch6.md#a-flickr-of-functional-programming)
  * [A Principled Refactor](ch6.md#a-principled-refactor)
  * [In Summary](ch6.md#in-summary)

## Part 2

* [Chapter 7: Hindley-Milner and Me](ch7.md)
  * [What's your type?](ch7.md#whats-your-type)
  * [Tales from the cryptic](ch7.md#tales-from-the-cryptic)
  * [Narrowing the possibility](ch7.md#narrowing-the-possibility)
  * [Free as in theorem](ch7.md#free-as-in-theorem)
  * [In Summary](ch7.md#in-summary)
* [Chapter 8: Tupperware](ch8.md)
  * [The Mighty Container](ch8.md#the-mighty-container)
  * [My First Functor](ch8.md#my-first-functor)
  * [Schrödinger’s Maybe](ch8.md#schrodingers-maybe)
  * [Pure Error Handling](ch8.md#pure-error-handling)
  * [Old McDonald had Effects…](ch8.md#old-mcdonald-had-effects)
  * [Asynchronous Tasks](ch8.md#asynchronous-tasks)
  * [A Spot of Theory](ch8.md#a-spot-of-theory)
  * [In Summary](ch8.md#in-summary)
* [Chapter 9: Monadic Onions](ch9.md)
  * [Pointy Functor Factory](ch9.md#pointy-functor-factory)
  * [Mixing Metaphors](ch9.md#mixing-metaphors)
  * [My chain hits my chest](ch9.md#my-chain-hits-my-chest)
  * [Theory](ch9.md#theory)
  * [In Summary](ch9.md#in-summary)
* [Chapter 10: Applicative Functors](ch10.md)
  * [Applying Applicatives](ch10.md#applying-applicatives)
  * [Ships in bottles](ch10.md#ships-in-bottles)
  * [Coordination Motivation](ch10.md#coordination-motivation)
  * [Bro, do you even lift?](ch10.md#bro-do-you-even-lift)
  * [Free can openers](ch10.md#free-can-openers)
  * [Laws](ch10.md#laws)
  * [In Summary](ch10.md#in-summary)


# Plans for the future

* Part 1 is a guide to the basics. I'm updating as I find errors since this is the initial draft. Feel free to help!
* Part 2 will address type classes like functors and monads all the way through to traversable. I hope to squeeze in transformers and a pure application.
* Part 3 will start to dance the fine line between practical programming and academic absurdity. We'll look at comonads, f-algebras, free monads, yoneda, and other categorical constructs.

