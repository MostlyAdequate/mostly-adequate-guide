const {add,curry,map,split,filter,test,reduce} = require('ramda');

//-- Exercise 1 -------------------------------------------------------
const words = split(' ');

//-- Exercise 1a ------------------------------------------------------
const sentences = map(words);


//-- Exercise 2 -------------------------------------------------------
const filterQs = filter(test(/q/i));


//-- Exercise 3 -------------------------------------------------------
// Use the helper function `_keepHighest` to refactor `max` to not reference any arguments
const _keepHighest = (x,y) => x >= y ? x : y;

const max = reduce(_keepHighest, -Infinity);


//-- Bonus 1 ----------------------------------------------------------
// wrap array's slice to be functional and curried.
// [1,2,3].slice(0, 2)
const slice = curry((start, end, xs) => xs.slice(start, end));


//-- Bonus 2 ----------------------------------------------------------
// use slice to define a function "take" that takes n elements. Make it curried
const take = slice(0);

//-- Exports ----------------------------------------------------------
module.exports = {
  words: words,
  sentences: sentences,
  filterQs: filterQs,
  max: max,
  slice: slice,
  take: take
};
