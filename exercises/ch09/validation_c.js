/* globals joinMailingList */

const res = joinMailingList('email@email.com');

assert(
  res instanceof Either,
  'The function has an invalid type; hint: `joinMailingList` should return an Either String (IO ())',
);

if (res.$value.unsafePerformIO() instanceof IO) {
  throw new Error('The function gives incorrect results; hint: make sure to `chain` effects as you go');
}

const getResult = either(identity, unsafePerformIO);

assert(
  getResult(joinMailingList('sleepy@grandpa.net')) === 'sleepy@grandpa.net',
  'The function gives incorrect results.',
);

assert(
  getResult(joinMailingList('notanemail')) === 'invalid email',
  'The function gives incorrect results.',
);
