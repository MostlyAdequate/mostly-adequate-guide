/* globals eitherToMaybe */

const just = eitherToMaybe(Either.of('one eyed willy'));
const noth = eitherToMaybe(left('some error'));

assert(
  just instanceof Maybe && just.isJust && just.$value === 'one eyed willy',
  'The function maps the `Right()` side incorrectly; hint: `Right(14)` should be mapped to `Just(14)`',
);

assert(
  noth instanceof Maybe && noth.isNothing,
  'The function maps the `Left()` side incorrectly; hint: `Left(\'error\')` should be mapped to `Nothing`',
);
