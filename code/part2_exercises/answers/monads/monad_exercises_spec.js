require('../../support');
var E = require('./monad_exercises');
var assert = require("chai").assert
var _ = require('ramda');

describe("Monad Exercises", function(){

  it('Exercise 1', function(){
    assert.deepEqual(E.ex1(E.user), Maybe.of('Walnut St'));
  });

  it('Exercise 2', function(){
    assert.equal(E.ex2(undefined).unsafePerformIO(), 'logged monad_exercises.js');
  });

  it('Exercise 3', function(done){
    E.ex3(13).fork(console.log, function (res) {
      assert.deepEqual(res.map(_.prop('post_id')), [13, 13]);
      done();
    });
  });

  it('Exercise 4', function(){
    var getResult = either(_.identity, unsafePerformIO);
    assert.equal(getResult(E.ex4('notanemail')), 'invalid email');
    assert.equal(getResult(E.ex4('sleepy@grandpa.net')), 'emailed: sleepy@grandpa.net');
  });

});
