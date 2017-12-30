require('../../../part2_exercises/support');
var E = require('./natural_transformation_exercises');
var assert = require("chai").assert;
const Task = require('data.task');
const {identity} = require('ramda');

describe("Natural Transformation Exercises", function(){

  it('Exercise 1', function(){
    assert.deepEqual(Maybe.of('one eyed willy'), E.ex1(new Right('one eyed willy')));
    assert.deepEqual(Maybe.of(null), E.ex1(new Left('some error')));
  });

  it('Exercise 2', function(done){
    Task.of(test1 => test2 => [test1, test2])
    .ap(E.ex2(2).map(x => assert.equal(x, 'userface')))
    .ap(E.ex2(0).fold(identity, identity).map(x => assert.equal(x, 'not found'))) //recover error
    .fork(() => { throw('ex2 failed') }, () => done())
  });

  it('Exercise 3', function(){
    assert.equal('emorst', E.ex3('sortme'))
  });
});
