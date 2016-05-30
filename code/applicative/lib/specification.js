const
  {assert: {deepEqual,equal}} = require("chai"),
  {Maybe}                     = require('../../support');

module.exports = (title,E) =>
  describe(title, () => {
    it('Exercise 1', () => {
      deepEqual(Maybe.of(5), E.ex1(2, 3));
      deepEqual(Maybe.of(null), E.ex1(null, 3));
    });

    it('Exercise 2', () => {
      deepEqual(Maybe.of(5), E.ex2(Maybe.of(2), Maybe.of(3)));
      deepEqual(Maybe.of(null), E.ex2(Maybe.of(null), Maybe.of(3)));
    });

    const
      ex3Html =
        "<div>Love them tasks</div><li>This book should be illegal</li><li>Monads are like space burritos</li>"
    it('Exercise 3', (done) => {
      E.ex3.fork(console.log, html => { equal(ex3Html, html); done(); });
    });

    it('Exercise 4', () => equal("toby vs sally", E.ex4.unsafePerformIO()));
  });
