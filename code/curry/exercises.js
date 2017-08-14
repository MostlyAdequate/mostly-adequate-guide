const {curry,map,split,filter,test,reduce} = require('ramda');

//-- Exercise 1 -------------------------------------------------------
// Refactor to remove all arguments by partially applying the function
const words = str => split(' ', str);

//-- Exercise 1a ------------------------------------------------------
// Use `map` to make a new words fn that works on an array of strings.
const sentences = undefined;


//-- Exercise 2 -------------------------------------------------------
// Refactor to remove all arguments by partially applying the functions
const filterQs = xs => filter(x => test(/q/i, x), xs);


//-- Exercise 3 -------------------------------------------------------
// Use the helper function `_keepHighest` to refactor `max` to not reference any arguments
const _keepHighest = (x,y) => x >= y ? x : y;

const max = xs => reduce((acc,x) => _keepHighest(acc, x), -Infinity, xs);


//-- Bonus 1 ----------------------------------------------------------
// Wrap array's slice to be functional and curried.
// [1,2,3].slice(0, 2)
const slice = undefined;

//-- Bonus 2 ----------------------------------------------------------
// Use slice to define a function "take" that returns n elements from the beginning of an array. Make it curried.
// For ['a', 'b', 'c'] with n=2 it should return ['a', 'b'].
const take = undefined;


//-- Exports ----------------------------------------------------------
module.exports = {
  words,
  sentences,
  filterQs,
  max,
  slice,
  take
};
