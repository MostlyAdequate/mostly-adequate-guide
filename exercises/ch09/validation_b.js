/* globals logFilename */

assert(
  logFilename(undefined) instanceof IO,
  'The function gives incorrect results; hint: `logFilename` should return an IO()',
);

if (logFilename(undefined).unsafePerformIO() instanceof IO) {
  throw new Error('The function gives incorrect results; hint: make sure to `chain` effects as you go');
}

assert(
  logFilename(undefined).unsafePerformIO() === 'ch09.md',
  'The function gives incorrect results; hint: did you retrieve the file\'s basename ?',
);
