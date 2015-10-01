var E = require('./curry_exercises');
var assert = require("chai").assert;

describe("Curry Exercises", function(){

  it('Exercise 1', function(){
    assert.deepEqual(E.words("Jingle bells Batman smells"), ['Jingle', 'bells', 'Batman', 'smells']);
  });

  it('Exercise 1a', function(){
    assert.deepEqual(E.sentences(["Jingle bells Batman smells", "Robin laid an egg"]), [['Jingle', 'bells', 'Batman', 'smells'], ['Robin', 'laid', 'an', 'egg']]);
  });

  it('Exercise 2', function(){
    assert.deepEqual(E.filterQs(['quick', 'camels', 'quarry', 'over', 'quails']), ['quick', 'quarry', 'quails']);
  });

  it('Exercise 3', function(){
    assert.equal(E.max([323,523,554,123,5234]), 5234);
  });

  if (E.slice != undefined) {
    it('Curry Bonus 1', function(){
      assert.deepEqual(E.slice(1)(3)(['a', 'b', 'c']), ['b', 'c']);
    });
  }

  if (E.take != undefined) {
    it('Curry Bonus 2', function(){
      assert.deepEqual(E.take(2)(['a', 'b', 'c']), ['a', 'b']);
    });
  }

});
