require('../../support');
var E = require('./functor_exercises');
var assert = require("chai").assert;

describe("Functor Exercises", function(){

  it('Exercise 1', function(){
    assert.deepEqual(E.ex1(Identity.of(2)), Identity.of(3));
  });

  it('Exercise 2', function(){
    var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
    assert.deepEqual(E.ex2(xs), Identity.of('do'));
  });

  it('Exercise 3', function(){
    var user = { id: 2, name: "Albert" };
    assert.deepEqual(E.ex3(user), Maybe.of('A'));
  });

  it('Exercise 4', function(){
    assert.deepEqual(E.ex4("4"), Maybe.of(4));
  });

  it('Exercise 5', function(done){
    E.ex5(13).fork(console.log, function(res){
      assert.deepEqual(res, 'LOVE THEM FUTURES');
      done();
    })
  });

  it('Exercise 6', function(){
    assert.deepEqual(E.ex6({active: false, name: 'Gary'}), Left.of('Your account is not active'));
    assert.deepEqual(E.ex6({active: true, name: 'Theresa'}), Right.of('Welcome Theresa'));
  });

  it('Exercise 7', function(){
    assert.deepEqual(E.ex7("fpguy99"), Right.of("fpguy99"));
    assert.deepEqual(E.ex7("..."), Left.of("You need > 3"));
  });

  it('Exercise 8', function(){
    assert.deepEqual(E.ex8("fpguy99").unsafePerformIO(), "fpguy99-saved");
    assert.deepEqual(E.ex8("...").unsafePerformIO(), "You need > 3");
  });
});
