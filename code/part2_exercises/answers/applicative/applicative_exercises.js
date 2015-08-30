require('../../support');
var Task = require('data.task');
var _ = require('ramda');

// fib browser for test
var localStorage = {};



// Exercise 1
// ==========
// Write a function that add's two possibly null numbers together using Maybe and ap()

var ex1 = function(x, y) {
  return Maybe.of(_.add).ap(Maybe.of(x)).ap(Maybe.of(y));
};


// Exercise 2
// ==========
// Rewrite 1 to use liftA2 instead of ap()

var ex2 = liftA2(_.add);



// Exercise 3
// ==========
// Run both getPost(n) and getComments(n) then render the page with both. (the n arg is arbitrary)
var makeComments = _.reduce(function(acc, c){ return acc+"<li>"+c+"</li>" }, "");
var render = _.curry(function(p, cs) { return "<div>"+p.title+"</div>"+makeComments(cs); });


var ex3 = Task.of(render).ap(getPost(2)).ap(getComments(2));
// or
// var ex3 = liftA2(render, getPost(2), getComments(2))




// Exercise 4
// ==========
// Write an IO that gets both player1 and player2 from the cache and starts the game
localStorage.player1 = "toby";
localStorage.player2 = "sally";

var getCache = function(x) {
  return new IO(function() { return localStorage[x]; });
}
var game = _.curry(function(p1, p2) { return p1 + ' vs ' + p2; });

var ex4 = liftA2(game, getCache('player1'), getCache('player2'));





// TEST HELPERS
// =====================

function getPost(i) {
  return new Task(function (rej, res) {
    setTimeout(function () { res({ id: i, title: 'Love them tasks' }); }, 300);
  });
}

function getComments(i) {
  return new Task(function (rej, res) {
    setTimeout(function () {
      res(["This book should be illegal", "Monads are like space burritos"]);
    }, 300);
  });
}

module.exports = {ex1: ex1, ex2: ex2, ex3: ex3, ex4: ex4}
