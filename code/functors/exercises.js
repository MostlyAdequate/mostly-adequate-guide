const
  SUPPORT_PATH                          = '../support',
  {Identity,IO,Maybe,Right,Left,either} = require(SUPPORT_PATH),
  Task                                  = require('data.task'),
  {add,concat,compose,curry,head,map,prop,toUpper} = require('ramda');

//-- Exercise 1 -------------------------------------------------------
// Use `add(x,y)` and `map(f,x)` to make a function that increments a value inside a functor
const ex1 = undefined;


//-- Exercise 2 -------------------------------------------------------
// Use head to get the first element of the list
const xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);

const ex2 = undefined;


//-- Exercise 3 -------------------------------------------------------
// Use `safeProp` and `head` to find the first initial of the user
const
  safeProp = curry((x,o) => Maybe.of(o[x])),
  user     = { id: 2, name: "Albert" };

const ex3 = undefined;


//-- Exercise 4 -------------------------------------------------------
// Use Maybe to rewrite ex4 without an if statement
const ex4 = n => (n===null || n===undefined)? null : parseInt(n);


//-- Exercise 5 -------------------------------------------------------
// Write a function that will getPost then toUpper the post's title
const
  // getPost :: Int -> Task({id: Int, title: String})
  {getPost}  = require(SUPPORT_PATH),
  upperTitle = compose(toUpper, prop('title'));

const ex5 = undefined;


//-- Exercise 6 -------------------------------------------------------
// Write a function that uses `checkActive` and `showWelcome` to grant access or return the error
const
  showWelcome = compose(concat( "Welcome "), prop('name'))
  checkActive = user =>
    user.active
      ? Right.of(user)
      : Left.of('Your account is not active');

const ex6 = undefined;



//-- Exercise 7 -------------------------------------------------------
// Write a validation function that checks for a length > 3. It should return Right(x) if it is greater than 3 and Left("You need > 3") otherwise (don't be pointfree).
const ex7 = x => undefined;


//-- Exercise 8 -------------------------------------------------------
// Use ex7 above and Either as a functor to save the user if they are valid or return the error message string. Remember either's two arguments must return the same type.
const save = x =>
  new IO(() => {
    console.log("SAVED USER!");
    return `${x}-saved`;
  });


const ex8 = undefined;


//-- Exports ----------------------------------------------------------
module.exports = {ex1,ex2,ex3,ex4,ex5,ex6,ex7,ex8};
