<img src="images/cover.png"/>

## About this book

This is a book on the functional paradigm in general. We'll use the world's most popular functional programming language: JavaScript. Some may feel this is a poor choice as it's against the grain of the current culture which, at the moment, feels predominately imperative. However, I believe it is the best way to learn FP for several reasons:

 * You likely use it every day at work.

    This makes it possible to practice and apply your acquired knowledge each day on real world programs rather than pet projects on nights and weekends in an esoteric FP language.


 * We don't have to learn everything up front to start writing programs.

    In a pure functional language, you cannot log a variable or read a DOM node without using monads. Here we can cheat a little as we learn to purify our codebase. It's also easier to get started in this language since it's mixed paradigm and you can fall back on your current practices while there are gaps in your knowledge.


 * The language is fully capable of writing top notch functional code.

    We have all the features we need to mimic a language like Scala or Haskell with the help of a tiny library or two. Object-oriented programming currently dominates the industry, but it's clearly awkward in JavaScript. It's akin to camping off of a highway or tap dancing in clogs. We have to `bind` all over the place lest `this` change out from under us, we don't have classes[^Yet], we have various work arounds for the quirky behavior when the `new` keyword is forgotten, private members are only available via closures. To a lot of us, FP feels more natural anyways.

* [Chapter 1: What ever are we doing?](ch1.md)
* [Chapter 2: First Class Functions](ch2.md)
* [Chapter 3: Pure Happiness with Pure Functions](ch3.md)
* [Chapter 4: Currying](ch4.md)
* [Chapter 5: Coding by Composing](ch5.md)
* [Chapter 6: Example Application](ch6.md)

