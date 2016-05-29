const
  {IO,Maybe}         = require('../../../support'),
  Task               = require('data.task'),
  {add,curry,reduce} = require('ramda');


//-- Exercise 1 -------------------------------------------------------
// Write a function that add's two possibly null numbers together using `Maybe` and `ap`
const
  // ex1 :: Number -> Number -> Maybe Number
  ex1 = (x,y) => undefined


//-- Exercise 2 -------------------------------------------------------
// Now write a function that takes 2 Maybe's and adds them. Use `liftA2` instead of `ap`.
const
  // ex2 :: Maybe Number -> Maybe Number -> Maybe Number
  ex2 = undefined;


//-- Exercise 3 -------------------------------------------------------
// Run both `getPost(n)` and `getComments(n)` then render the page with both. (the n arg is arbitrary)
const
  makeComments = reduce((acc, c) => `${acc}<li>${c}</li>`, ""),
  render       = curry((p, cs) => `<div>${p.title}</div>${makeComments(cs)}`);

// ex3 :: Task Error HTML
const ex3 = undefined;


//-- Exercise 4 -------------------------------------------------------
// Write an IO that gets both player1 and player2 from the cache and starts the game
const
  localStorage = {player1: "toby", player2: "sally"},
  getCache     = x => new IO(() => localStorage[x]),
  game         = curry((p1, p2) => `${p1} vs ${p2}`);

// ex4 :: IO String
const ex4 = undefined;
