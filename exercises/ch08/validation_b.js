/* globals initial */

if (!(initial(albert) instanceof Maybe) && initial.callees && initial.callees[0] === 'safeProp' && initial.callees[1] === 'head') {
  throw new Error('The function gives incorrect results; hint: look carefully at the signatures of `safeProp` and `head`!');
}

assert(
  initial(albert).$value === 'A',
  'The function gives incorrect results.',
);

assert.arrayEqual(
  initial.callees || [],
  ['safeProp', 'map'],
  'The answer is incorrect; hint: you can compose `safeProp` with `head` in a declarative way',
);
