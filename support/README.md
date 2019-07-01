# Mostly Adequate Guide to Functional Programming - Support

## Overview 

This package contains all functions and data-structure referenced in the
appendixes of the [Mostly Adequate Guide to Functional Programming](https://github.com/MostlyAdequate/mostly-adequate-guide).

These functions have an educational purpose and aren't intended to be used in
any production environment. They are however, a good learning material for anyone
interested in functional programming.

## How to install

The package is available on `npm` and can be installed via the following incantation:

```
npm install @mostly-adequate/support
```

## How to use

There's no particular structure to the module, everything is flat and exported
from the root (the curious reader may have a quick glance at the `index.js` to
get convinced about this). 

Also, all top-level functions are curried so you don't have to worry about calling
`curry` on any of them.

For example:

```js
const { Maybe, liftA2, append, concat, reverse } = require('@mostly-adequate/support');

const a = Maybe.of("yltsoM").map(reverse);
const b = Maybe.of("Adequate").map(concat(" "));

liftA2(append)(b)(a);
// Just("Mostly Adequate")
```
