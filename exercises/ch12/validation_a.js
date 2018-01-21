/* globals getJsons */

const throwUnexpected = () => {
  throw new Error('The function gives incorrect results; a Task has resolved unexpectedly!');
};

const res = getJsons(routes);

assert(
  res instanceof Task,
  'The function has an invalid type; hint: `getJsons` must return a `Task`!',
);

res.fork(throwUnexpected, ($res) => {
  assert(
    $res.$value['/'] === 'json for /' && $res.$value['/about'] === 'json for /about',
    'The function gives incorrect results; hint: did you correctly map `httpGet` over the Map\'s values?',
  );

  const callees = getJsons.callees; // eslint-disable-line prefer-destructuring

  if (callees && callees[0] === 'map' && callees[1] === 'sequence') {
    throw new Error('The function could be written in a simpler form; hint: compose(sequence(of), map(fn)) === traverse(of, fn)');
  }
});
