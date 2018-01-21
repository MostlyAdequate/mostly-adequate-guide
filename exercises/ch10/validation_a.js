/* globals safeAdd */

const res = safeAdd(Maybe.of(2), Maybe.of(3));
assert(
  res instanceof Maybe && typeof res.$value === 'number',
  'The function has a wrong type; make sure to wrap your numbers inside `Maybe.of`',
);

assert(
  safeAdd(Maybe.of(2), Maybe.of(3)).$value === 5,
  'The function gives incorrect results; did you use `add` ?',
);

assert(
  safeAdd(Maybe.of(null), Maybe.of(3)).isNothing,
  'The function gives incorrect results; `Nothing` should be returned when at least one value is `null`',
);

assert(
  safeAdd(Maybe.of(2), Maybe.of(null)).isNothing,
  'The function gives incorrect results; `Nothing` should be returned when at least one value is `null`',
);

assert(
  withSpyOn('ap', Maybe.prototype, () => safeAdd(Maybe.of(2), Maybe.of(3))),
  'The function seems incorrect; did you use `ap` ?',
);
