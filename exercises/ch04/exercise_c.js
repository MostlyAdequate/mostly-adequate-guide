// Considering the following function:
//
//   const keepHighest = (x, y) => (x >= y ? x : y);
//
// Refactor `max` to not reference any arguments using the helper function `keepHighest`.

// max :: [Number] -> Number
// const max = xs => reduce((acc, x) => (x >= acc ? x : acc), -Infinity, xs);
// const max = reduce((acc, x) => (x >= acc ? x : acc), -Infinity);
//   the first arg to reduce is: (acc, x) => (x >= acc ? x : acc)
//   this matches the definition of keepHighest exactly. so drop keepHighest in there.
const max = reduce(keepHighest, -Infinity);
