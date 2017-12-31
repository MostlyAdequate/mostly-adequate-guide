/* globals isLastInStock */

const fixture01 = cars.slice(0, 3);
const fixture02 = cars.slice(3);

try {
  assert(
    isLastInStock(fixture01),
    'The function gives incorrect results.',
  );

  assert(
    !isLastInStock(fixture02),
    'The function gives incorrect results.',
  );
} catch (err) {
  const callees = isLastInStock.callees || [];

  if (callees[0] === 'prop' && callees[1] === 'last') {
    throw new Error('The answer is incorrect; hint: functions are composed from right to left!');
  }

  throw err;
}

assert.arrayEqual(
  isLastInStock.callees || [],
  ['last', 'prop'],
  'The answer is incorrect; hint: prop is currified!',
);
