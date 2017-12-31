/* globals getStreetName */

const res = getStreetName(albert);

if ((!(res instanceof Maybe) || typeof res.$value !== 'string' || res.isNothing) && getStreetName.callees) {
  [1, 2, 3].forEach((i) => {
    if (getStreetName.callees[i] === 'map' && getStreetName.callees[i + 1] !== 'join') {
      throw new Error('The function gives incorrect results; hint: you can use `join` to flatten two monads!');
    }
  });

  [1, 2].forEach((i) => {
    if (!['map', 'chain'].includes(getStreetName.callees[i])) {
      throw new Error('The function gives incorrect results; hint: look carefully at the signature of `safeProp` and `chain`!');
    }
  });
}

assert(
  getStreetName(albert).$value === 'Walnut St',
  'The function gives incorrect results.',
);

assert(
  getStreetName(gary).isNothing,
  'The function gives incorrect results.',
);

assert(
  getStreetName(theresa).isNothing,
  'The function gives incorrect results.',
);
