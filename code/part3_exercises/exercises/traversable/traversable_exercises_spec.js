require('../../../part2_exercises/support');
var E = require('./traversable_exercises');
var assert = require("chai").assert;
const Task = require('data.task');
const {identity} = require('ramda');
const {Map} = require('immutable-ext');

describe("Traversable Exercises", function(){

  it('Exercise 1', function(){
    E.ex1.fork(e => { throw 'failed ex1' }, result =>
      assert.deepEqual(result.get('/'), 'json for /')
    )
  });

  it('Exercise 2', function(){
    const res1 = E.ex2([{name: 'sayid'}, {name: 'carla'}])
    assert.equal(typeof res1.__value, 'string', 'return an either')
    assert.equal(res1.__value, 'game started!')
    const res2 = E.ex2([{name: ''}, {name: 'carla'}])
    assert.equal(res2.__value, 'must have name')
  });

  it('Exercise 3', function(done) {
    E.ex3('.').fork(e => { throw 'failed ex3'}, result => {
      assert.equal(typeof result.__value, 'string', 'return a maybe, not a task')
      assert(result.__value.match(/traverse/))
      done()
    })
  });
});
