/* globals findNameById */

const throwUnexpected = () => {
  throw new Error('The function gives incorrect results; a Task has resolved unexpectedly!');
};

const res = findNameById(1);

assert(
  res instanceof Task,
  'The function has an incorrect type; hint: `findNameById` must return a `Task String User`!',
);

res.fork(throwUnexpected, (val) => {
  assert(
    !(val instanceof Task),
    'The function has an incorrect type; hint: `findNameById` must return a `Task String User`, make sure to flatten any nested Functor!',
  );

  assert(
    !(val instanceof Either),
    'The function has an incorrect type; hint: did you use `eitherToTask` ?',
  );

  assert(
    val === 'Albert',
    'The function gives incorrect results for the `Right` side of `Either`.',
  );
});


const rej = findNameById(999);

assert(
  rej instanceof Task,
  'The function has an incorrect type; hint: `findNameById` must return a `Task String User`!',
);

rej.fork((val) => {
  assert(
    !(val instanceof Task),
    'The function has an incorrect type; hint: `findNameById` must return a `Task String User`, make sure to flatten any nested Functor!',
  );

  assert(
    val === 'not found',
    'The function gives incorrect results for the `Left` side of `Either`.',
  );
}, throwUnexpected);
