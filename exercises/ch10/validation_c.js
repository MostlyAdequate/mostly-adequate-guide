/* globals startGame */

assert(
  startGame instanceof IO && typeof startGame.unsafePerformIO() === 'string',
  'The answer has a wrong type; `startGame` should be an `IO String`',
);

assert(
  startGame.unsafePerformIO() === `${albert.name} vs ${theresa.name}`,
  'The answer gives incorrect results',
);
