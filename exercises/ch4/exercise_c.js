// Considering the following function:
//
//   const keepHighest = (x, y) => (x >= y ? x : y);
//
// Refactor `max` to not reference any arguments using the helper function `keepHighest`.

const max = xs => reduce((acc, x) => (x >= acc ? x : acc), -Infinity, xs);
