/* globals filterQs */

filter.calledPartial = false;
match.calledPartial = false;

assert.arrayEqual(
  filterQs(['quick', 'camels', 'quarry', 'over', 'quails']),
  ['quick', 'quarry', 'quails'],
  'The function gives incorrect results.',
);

assert(
  filter.partially,
  'The answer is incorrect; hint: look at the arguments for `filter`.',
);

assert(
  match.partially,
  'The answer is incorrect; hint: look at the arguments for `match`.',
);
