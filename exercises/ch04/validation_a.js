/* globals words */

assert.arrayEqual(
  words('Jingle bells Batman smells'),
  ['Jingle', 'bells', 'Batman', 'smells'],
  'The function gives incorrect results.',
);

assert(
  split.partially,
  'The answer is incorrect; hint: split is currified!',
);
