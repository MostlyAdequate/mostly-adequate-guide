/* globals readFirst */

const res = readFirst('__dirname');

const throwUnexpected = () => {
  throw new Error('The function gives incorrect results; a Task has resolved unexpectedly!');
};

assert(
  res instanceof Task,
  'The function has an invalid type; hint: `readFirst` must return a `Task`!',
);

res.fork(throwUnexpected, ($res) => {
  assert(
    $res instanceof Maybe,
    'The function has an invalid type; hint: `readFirst` must return a `Task Error (Maybe String)`!',
  );

  assert(
    $res.isJust && $res.$value === 'content of file1 (utf-8)',
    'The function gives incorrect results.',
  );
});
