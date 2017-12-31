/* globals fastestCar */

try {
  assert(
    fastestCar(cars) === 'Aston Martin One-77 is the fastest',
    'The function gives incorrect results.',
  );
} catch (err) {
  const callees = fastestCar.callees || [];

  if (callees.length > 0 && callees[0] !== 'sortBy') {
    throw new Error('The answer is incorrect; hint: functions are composed from right to left!');
  }

  throw err;
}

const callees = fastestCar.callees || [];

assert.arrayEqual(
  callees.slice(0, 3),
  ['sortBy', 'last', 'prop'],
  'The answer is incorrect; hint: Hindley-Milner signatures help a lot to reason about composition!',
);
