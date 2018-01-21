/* globals validateName, register */

const validateGary = validateName(gary);
assert(
  validateGary instanceof Either && validateGary.isRight,
  'The function `validateName` gives incorrect results.',
);

const validateYi = validateName(yi);
assert(
  validateYi instanceof Either && validateYi.isLeft && typeof validateYi.$value === 'string',
  'The function `validateName` gives incorrect results!',
);

const registerAlbert = register(albert);
assert(
  registerAlbert instanceof IO,
  'The right outcome to `register` is incorrect; hint: `save` returns an `IO` and you\'ll need `map` to manipulate the inner value!',
);

const msgAlbert = registerAlbert.unsafePerformIO();
assert(
  typeof msgAlbert === 'string',
  'The right outcome to `register` is incorrect; hint: look carefully at your signatures, `register` should return an `IO(String)` in every scenarios!',
);

const callees = register.callees || [];

assert(
  callees[callees.length - 1] === 'either',
  'The function `register` seems incorrect; hint: you can use `either` to branch an `Either` to different outcomes!',
);

assert(
  msgAlbert === showWelcome(albert),
  'The function `register` returns a correct type, but the inner value is incorrect! Did you use `showWelcome`?',
);

const registerYi = register(yi);
assert(
  registerYi instanceof IO,
  'The left outcome to `register` is incorrect; hint: look carefully at your signatures, `register` should return an `IO` in every scenarios!',
);

const msgYi = registerYi.unsafePerformIO();
assert(
  typeof msgYi === 'string',
  'The left outcome to `register` is incorrect; hint: look carefully at your signatures, `register` should return an `IO(String)` in every scenarios!',
);
