# Mostly Adequate Exercises

## Overview

All exercises from the book can be completed either:

- in browser (using the version of the book published on [gitbook.io](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/))
- in your editor & terminal, using `npm`

In every folder named `ch**` from this `exercises/` folder, you'll find three types of files:

- exercises
- solutions
- validations

Exercises are structured with a statement in comment, followed by an incomplete
or incorrect function. For example, `exercise_a` from `ch04` looks like this:


```js
// Refactor to remove all arguments by partially applying the function.

// words :: String -> [String]
const words = str => split(' ', str);
```

Following the statement, your goal is to refactor the given function `words`. Once done, 
your proposal can be verified by running:

```
npm run ch04
```

Alternatively, you can also have a peak at the corresponding solution file: in this case
`solution_a.js`. 

> The files `validation_*.js` aren't really part of the exercises but are used
> internally to verify your proposal and, offer hints when adequate. The curious 
> reader may have a look at them :).

Now go and learn some functional programming λ!

## About the Appendixes

Important notice: the exercise runner takes care of bringing all
data-structures and functions from the appendixes into scope. Therefore, you
may assume that any function present in the appendix is just available for you
to use! Amazing, isn't it? 
