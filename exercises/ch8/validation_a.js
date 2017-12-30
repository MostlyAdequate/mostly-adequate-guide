/* globals incrF */

assert(
  incrF(Identity.of(2)).$value === 3,
  'The function gives incorrect results.',
);

assert(
  add.partially,
  'The answer is incorrect; hint: add is currified!',
);

assert(
  map.partially,
  'The answer is incorrect; hint: map is currified!',
);
