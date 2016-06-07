const
  {assert: {deepEqual,equal}}    = require("chai"),
  {Maybe,unsafePerformIO,either} = require('../../support'),
  {identity,prop}                = require('ramda');

module.exports = (title,E) =>
  describe(title, () => {
    it('Exercise 1', () => deepEqual(E.ex1(E.user), Maybe.of('Walnut St')));

    const
      ex2 = `logged ${title.toLowerCase()}.js`;
    it('Exercise 2', () => equal(E.ex2(undefined).unsafePerformIO(), ex2));

    it('Exercise 3', done => {
      E.ex3(13).fork(console.log, res => {
        deepEqual(res.map(prop('post_id')), [13, 13]);
        done();
      });
    });

    const
      ex4GetResult = either(identity, unsafePerformIO),
      ex4Email     = 'sleepy@grandpa.net',
      ex4Out       = `emailed: ${ex4Email}`;
    it('Exercise 4', () => {
      equal(ex4GetResult(E.ex4('notanemail')), 'invalid email');
      equal(ex4GetResult(E.ex4(ex4Email)),ex4Out);
    });
  });
