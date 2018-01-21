/* globals startGame */

const res = startGame(new List([albert, theresa]));

assert(
  res instanceof Either,
  'The function has an invalid type; hint: `startGame` must return a `Either`!',
);

assert(
  res.isRight && res.$value === 'game started!',
  'The function gives incorrect results; a game should have started for a list of valid players!',
);

const rej = startGame(new List([gary, { what: 14 }]));
assert(
  rej.isLeft && rej.$value === 'must have name',
  'The function gives incorrect results; a game shouldn\'t be started if the list contains invalid players!',
);

const callees = startGame.callees; // eslint-disable-line prefer-destructuring

if (callees && callees[0] === 'map' && callees[1] === 'sequence') {
  throw new Error('The function could be written in a simpler form; hint: compose(sequence(of), map(fn)) === traverse(of, fn)');
}
