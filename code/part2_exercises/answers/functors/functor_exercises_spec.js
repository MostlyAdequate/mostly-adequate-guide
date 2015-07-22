require('../../support');
var E = require('./functor_exercises');
var assert = require("chai").assert;

describe("Functor Exercises", function(){

  it('Exercise 1', function(){
    assert.deepEqual(Identity.of(3), E.ex1(Identity.of(2)));
  });

  it('Exercise 2', function(){
    var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
    assert.deepEqual(Identity.of('do'), E.ex2(xs));
  });

  it('Exercise 3', function(){
    var user = { id: 2, name: "Albert" };
    assert.deepEqual(Maybe.of('A'), E.ex3(user));
  });

  it('Exercise 4', function(){
    assert.deepEqual(Maybe.of(4), E.ex4("4"));
  });

  it('Exercise 5', function(done){
    E.ex5(13).fork(console.log, function(res){
      assert.deepEqual('LOVE THEM FUTURES', res);
      done();
    })
  });

  it('Exercise 6', function(){
    assert.deepEqual(Left.of('Your account is not active'), E.ex6({active: false, name: 'Gary'}));
    assert.deepEqual(Right.of('Welcome Theresa'), E.ex6({active: true, name: 'Theresa'}));
  });

  it('Exercise 7', function(){
    assert.deepEqual(Right.of("fpguy99"), E.ex7("fpguy99"));
    assert.deepEqual(Left.of("You need > 3"), E.ex7("..."));
  });

  it('Exercise 8', function(){
    assert.deepEqual("fpguy99-saved", E.ex8("fpguy99").unsafePerformIO());
    assert.deepEqual("You need > 3", E.ex8("...").unsafePerformIO());
  });
});
