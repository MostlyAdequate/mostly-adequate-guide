/* globals max */

assert(
  max([323, 523, 554, 123, 5234]) === 5234,
  'The function gives incorrect results.',
);

assert(
  reduce.partially,
  'The answer is incorrect; hint: look at the arguments for `reduce`!',
);

assert(
  keepHighest.calledBy && keepHighest.calledBy.name === '$reduceIterator',
  'The answer is incorrect; hint: look closely to `reduce\'s` iterator and `keepHighest`!',
);
