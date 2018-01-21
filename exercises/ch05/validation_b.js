/* globals averageDollarValue */

try {
  assert(
    averageDollarValue(cars) === 790700,
    'The function gives incorrect results.',
  );
} catch (err) {
  const callees = averageDollarValue.callees || [];

  if (callees[0] === 'average' && callees[1] === 'map') {
    throw new Error('The answer is incorrect; hint: functions are composed from right to left!');
  }

  throw err;
}

assert.arrayEqual(
  averageDollarValue.callees || [],
  ['map', 'average'],
  'The answer is incorrect; hint: map is currified!',
);

assert(
  prop.partially,
  'The answer is almost correct; hint: you can use prop to access objects\' properties!',
);
