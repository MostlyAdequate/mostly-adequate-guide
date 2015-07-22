require('../../support');
var Task = require('data.task');
var _ = require('ramda');

// Exercise 1
// ==========
// Use _.add(x,y) and map(f,x) to make a function that increments a value inside a functor

var ex1 = _.map(_.add(1));



// Exercise 2
// ==========
// Use _.head to get the first element of the list
var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);

var ex2 = _.map(_.head);



// Exercise 3
// ==========
// Use safeProp and _.head to find the first initial of the user
var safeProp = _.curry(function (x, o) { return Maybe.of(o[x]); });

var user = { id: 2, name: "Albert" };

var ex3 = _.compose(_.map(_.head), safeProp('name'));


// Exercise 4
// ==========
// Use Maybe to rewrite ex4 without an if statement

var ex4 = function (n) {
  if (n) { return parseInt(n); }
};

var ex4 = _.compose(_.map(parseInt), Maybe.of);


// Exercise 5
// ==========
// Write a function that will getPost then toUpperCase the post's title

// getPost :: Int -> Task({id: Int, title: String})
var getPost = function (i) {
  return new Task(function(rej, res) {
    setTimeout(function(){
      res({id: i, title: 'Love them futures'})  
    }, 300)
  });
};

var upperTitle = _.compose(toUpperCase, _.prop('title'));
var ex5 = _.compose(_.map(upperTitle), getPost);



// Exercise 6
// ==========
// Write a function that uses checkActive() and showWelcome() to grant access or return the error

var showWelcome = _.compose(_.add( "Welcome "), _.prop('name'))

var checkActive = function(user) {
 return user.active ? Right.of(user) : Left.of('Your account is not active')
}

var ex6 = _.compose(_.map(showWelcome), checkActive)



// Exercise 7
// ==========
// Write a validation function that checks for a length > 3. It should return Right(x) if it is greater than 3 and Left("You need > 3") otherwise

var ex7 = function(x) {
  return x.length > 3 ? Right.of(x) : Left.of("You need > 3");
}



// Exercise 8
// ==========
// Use ex7 above and Either as a functor to save the user if they are valid or return the error message string. Remember either's two arguments must return the same type.

var save = function(x){
  return new IO(function(){
    console.log("SAVED USER!");
    return x + '-saved';
  });
}

var ex8 = _.compose(either(IO.of, save), ex7)

module.exports = {ex1: ex1, ex2: ex2, ex3: ex3, ex4: ex4, ex5: ex5, ex6: ex6, ex7: ex7, ex8: ex8}
