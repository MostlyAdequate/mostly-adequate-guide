/* globals eitherWelcome */

if (!(eitherWelcome(gary) instanceof Either) && eitherWelcome.callees && eitherWelcome.callees[0] === 'checkActive' && eitherWelcome.callees[1] === 'showWelcome') {
  throw new Error('The function gives incorrect results; hint: look carefully at the signatures of `checkActive` and `showWelcome`!');
}

assert(
  eitherWelcome(gary).$value === 'Your account is not active',
  'The function gives incorrect results.',
);

assert(
  eitherWelcome(theresa).$value === 'Welcome Theresa',
  'The function gives incorrect results.',
);

assert.arrayEqual(
  eitherWelcome.callees || [],
  ['checkActive', 'map'],
  'The answer is incorrect; hint: you can compose `checkActive` with `showWelcome` in a declarative way!',
);
