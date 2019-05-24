/* globals logFilename */

assert(
  logFilename instanceof IO,
  'The function gives incorrect results; hint: `logFilename` should be an IO()',
);

if (logFilename.unsafePerformIO() instanceof IO) {
  throw new Error('The function gives incorrect results; hint: make sure to `chain` effects as you go');
}

assert(
  logFilename.unsafePerformIO() === 'ch09.md',
  'The function gives incorrect results; hint: did you retrieve the file\'s basename ?',
);
