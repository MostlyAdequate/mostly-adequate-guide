var _ = require('ramda');

//-- Exercise 1 -------------------------------------------------------
var words = _.split(' ');

//-- Exercise 1a ------------------------------------------------------
var sentences = _.map(words);


//-- Exercise 2 -------------------------------------------------------
var filterQs = _.filter(_.test(/q/i));


//-- Exercise 3 -------------------------------------------------------
// Use the helper function `_keepHighest` to refactor `max` to not reference any arguments
var _keepHighest = function(x,y) { return x >= y ? x : y; }

var max = _.reduce(_keepHighest, -Infinity);


//-- Bonus 1 ----------------------------------------------------------
// wrap array's slice to be functional and curried.
// [1,2,3].slice(0, 2)
var slice = _.curry(function(start, end, xs) { return xs.slice(start, end); });


//-- Bonus 2 ----------------------------------------------------------
// Use slice to define a function "take" that returns n elements from the beginning of an array. Make it curried.
// For ['a', 'b', 'c'] with n=2 it should return ['a', 'b'].
var take = slice(0);


//-- Exports ----------------------------------------------------------
module.exports = {
  words:words,
  sentences:sentences,
  filterQs:filterQs,
  max:max,
  slice:slice,
  take:take
};
