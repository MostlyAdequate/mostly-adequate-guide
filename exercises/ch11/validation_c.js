/* globals strToList, listToStr */

const sortLetters = compose(listToStr, sortBy(identity), strToList);

assert(
  sortLetters('sortme') === 'emorst',
  'The function gives incorrect results',
);
