const
  {IO,Maybe,getPost,getComments,liftA2} = require('../support'),
  Task                           = require('data.task'),
  {add,curry,reduce}             = require('ramda');

//-- Exercise 1 -------------------------------------------------------
// Write a function that add's two possibly null numbers together using `Maybe` and `ap`
const ex1 = (x,y) =>
  Maybe
    .of(add)
    .ap(Maybe.of(x))
    .ap(Maybe.of(y));


//-- Exercise 2 -------------------------------------------------------
// Now write a function that takes 2 Maybe's and adds them. Use `liftA2` instead of `ap`.
const ex2 = liftA2(add);


//-- Exercise 3 -------------------------------------------------------
// Run both `getPost(n)` and `getComments(n)` then render the page with both. (the n arg is arbitrary)
const
  makeComments = reduce((acc, {body}) => `${acc}<li>${body}</li>`, ""),
  render       = curry((p, cs) => `<div>${p.title}</div>${makeComments(cs)}`);

const ex3 =
  Task
    .of(render)
    .ap(getPost(2))
    .ap(getComments(2));
// or
// const ex3 = liftA2(render, getPost(2), getComments(2))


//-- Exercise 4 -------------------------------------------------------
// Write an IO that gets both player1 and player2 from the cache and starts the game
const
  localStorage = {player1: "toby", player2: "sally"},
  getCache     = x => new IO(() => localStorage[x]),
  game         = curry((p1, p2) => `${p1} vs ${p2}`);

const ex4 = liftA2(game, getCache('player1'), getCache('player2'));


//-- Exports ----------------------------------------------------------
module.exports = {ex1,ex2,ex3,ex4}
