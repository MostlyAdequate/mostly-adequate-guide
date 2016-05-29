const
  {Maybe} = require('../support'),
  {deepEqual,equal} = require("chai").assert,
  {identity,prop} = require('ramda');

module.exports = E =>
  describe("Monad Exercises", function(){
    it('Exercise 1', function(){
      deepEqual(E.ex1(E.user), Maybe.of('Walnut St'));
    });

    it('Exercise 2', function(){
      equal(E.ex2(undefined).unsafePerformIO(), 'logged monad_exercises.js');
    });

    it('Exercise 3', function(done){
      E.ex3(13).fork(console.log, function (res) {
        deepEqual(res.map(prop('post_id')), [13, 13]);
        done();
      });
    });

    it('Exercise 4', function(){
      var getResult = either(identity, unsafePerformIO);
      equal(getResult(E.ex4('notanemail')), 'invalid email');
      equal(getResult(E.ex4('sleepy@grandpa.net')),'emailed: sleepy@grandpa.net');
    });
  });
