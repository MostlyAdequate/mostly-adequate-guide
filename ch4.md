# Chapter 4: Currying

## Can't live if livin' is without you
My Dad once explained how there are certain things one can live without until one acquires them. A microwave is one such thing. Smart phones, another. The older folks among us will remember a fulfilling life sans internet. For me, currying is on this list.

The concept is simple: You can call a function with fewer arguments than it expects. It returns a function that takes the remaining arguments.

You can choose to call it all at once or simply feed in each argument piecemeal.

```js
const add = x => y => x + y;
const increment = add(1);
const addTen = add(10);

increment(2); // 3
addTen(2); // 12
```

Here we've made a function `add` that takes one argument and returns a function. By calling it, the returned function remembers the first argument from then on via the closure. Calling it with both arguments all at once is a bit of a pain, however, so we can use a special helper function called `curry` to make defining and calling functions like this easier.

Let's set up a few curried functions for our enjoyment.

```js
const { curry } = require('ramda');

const match = curry((what, s) => s.match(what));
const replace = curry((what, replacement, s) => s.replace(what, replacement));
const filter = curry((f, xs) => xs.filter(f));
const map = curry((f, xs) => xs.map(f));
```

The pattern I've followed is a simple, but important one. I've strategically positioned the data we're operating on (String, Array) as the last argument. It will become clear as to why upon use.

```js
match(/\s+/g, 'hello world'); // [ ' ' ]
match(/\s+/g)('hello world'); // [ ' ' ]

const hasSpaces = match(/\s+/g); // x => x.match(/\s+/g)
hasSpaces('hello world'); // [ ' ' ]
hasSpaces('spaceless'); // null

filter(hasSpaces, ['tori_spelling', 'tori amos']); // ['tori amos']

const findSpaces = filter(hasSpaces); // xs => xs.filter(x => x.match(/\s+/g))
findSpaces(['tori_spelling', 'tori amos']); // ['tori amos']

const noVowels = replace(/[aeiou]/ig); // (r,x) => x.replace(/[aeiou]/ig, r)
const censored = noVowels('*'); // x => x.replace(/[aeiou]/ig, '*')
censored('Chocolate Rain'); // 'Ch*c*l*t* R**n'
```

What's demonstrated here is the ability to "pre-load" a function with an argument or two in order to receive a new function that remembers those arguments.

I encourage you to `npm install ramda`, copy the code above and have a go at it in the REPL. You can also do this in a browser where lodash or ramda is available.

## More than a pun / special sauce

Currying is useful for many things. We can make new functions just by giving our base functions some arguments as seen in `hasSpaces`, `findSpaces`, and `censored`.

We also have the ability to transform any function that works on single elements into a function that works on arrays simply by wrapping it with `map`:

```js
const getChildren = x => x.childNodes;
const allTheChildren = map(getChildren);
```

Giving a function fewer arguments than it expects is typically called *partial application*. Partially applying a function can remove a lot of boiler plate code. Consider what the above `allTheChildren` function would be with the uncurried `map` from lodash (note the arguments are in a different order):

```js
const allTheChildren = elements => map(elements, getChildren);
```

We typically don't define functions that work on arrays, because we can just call `map(getChildren)` inline. Same with `sort`, `filter`, and other higher order functions(Higher order function: A function that takes or returns a function).

When we spoke about *pure functions*, we said they take 1 input to 1 output. Currying does exactly this: each single argument returns a new function expecting the remaining arguments. That, old sport, is 1 input to 1 output.

No matter if the output is another function - it qualifies as pure. We do allow more than one argument at a time, but this is seen as merely removing the extra `()`'s for convenience.


## In summary

Currying is handy and I very much enjoy working with curried functions on a daily basis. It is a tool for the belt that makes functional programming less verbose and tedious.

We can make new, useful functions on the fly simply by passing in a few arguments and as a bonus, we've retained the mathematical function definition despite multiple arguments.

Let's acquire another essential tool called `compose`.

[Chapter 5: Coding by Composing](ch5.md)

## Exercises

A quick word before we start. We'll use a library called *ramda* which curries every function by default. Alternatively you may choose to use *lodash-fp* which does the same and is written/maintained by the creator of lodash. Both will work just fine and it is a matter of preference.

[ramda](http://ramdajs.com)
[lodash-fp](https://github.com/lodash/lodash-fp)

There are [unit tests](https://github.com/DrBoolean/mostly-adequate-guide/tree/master/code/part1_exercises) to run against your exercises as you code them, or you can just copy-paste into a JavaScript REPL for the early exercises if you wish.

Answers are provided with the code in the [repository for this book](https://github.com/DrBoolean/mostly-adequate-guide/tree/master/code/part1_exercises/answers)

[include](./code/curry/exercises.js)
