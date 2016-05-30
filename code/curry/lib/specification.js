const
  {assert: {deepEqual,equal}} = require("chai");

module.exports = (title,E) =>
  describe(title, () => {
    const
      ex1In   = "Jingle bells Batman smells",
      R       = "Robin laid an egg",
      ex1Out  = ex1In.split(' '),
      ex1aIn  = [ex1In , R],
      ex1aOut = [ex1Out, R.split(' ')];
    it('Exercise 1',  () => deepEqual(E.words(ex1In), ex1Out));
    it('Exercise 1a', () => deepEqual(E.sentences(ex1aIn), ex1aOut));

    const
      ex2Common = ['quick','quarry','quails'],
      ex2In     = ex2Common.concat(['camels','over']),
      ex2Out    = ex2Common;
    it('Exercise 2', () => deepEqual(E.filterQs(ex2In), ex2Out));
    it('Exercise 3', () => equal(E.max([323,523,554,123,5234]), 5234));

    const
      xs = ['a', 'b', 'c'];
    if (E.slice != undefined) {
      it('Curry Bonus 1', () => deepEqual(E.slice(1)(3)(xs), ['b', 'c']));
    }
    if (E.take != undefined) {
      it('Curry Bonus 2', () => deepEqual(E.take(2)(xs), ['a', 'b']));
    }
  });
