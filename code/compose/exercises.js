var
  /*
    data CAR =
      {name         :: String
      ,horsepower   :: Number
      ,dollar_value :: Number
      ,in_stock     :: Bool}
  */
  CARS        = require('./lib/mock.cars').CARS,
  formatMoney = require('accounting').formatMoney,
  _           = require('ramda');

//-- Exercise 1 -------------------------------------------------------
// use `_.compose` to rewrite the function below. Hint: `_.prop` is curried.
var isLastInStock = function(cars) {
  return _.prop('in_stock', _.last(cars))
};


//-- Exercise 2 -------------------------------------------------------
// use `_.compose`, `_.prop` and `_.head` to retrieve the name of the first car
var nameOfFirstCar = undefined;


//-- Exercise 3 -------------------------------------------------------
// Use the helper function `_average` to refactor `averageDollarValue` as a composition
var _average = function(xs) { return _.reduce(_.add, 0, xs) / xs.length; };

var averageDollarValue = function(cars) {
  var dollar_values =  _.map(_.prop('dollar_value'), cars);
  return _average(dollar_values);
};


//-- Exercise 4 -------------------------------------------------------
// Write a function: `sanitizeNames` using `_.compose` that takes an array of cars and returns a list of lowercase and underscored names: e.g: sanitizeNames([{name: "Ferrari FF"}]) => ["ferrari_ff"].
var _underscore = _.replace(/\W+/g, '_');

var sanitizeNames = undefined;


//-- Bonus 1 ---------------------------------------------------------
var availablePrices = function(cars) {
  return cars
    .filter(_.prop('in_stock'))
    .map(function(x){ return formatMoney(x.dollar_value)})
    .join(', ');
};


//-- Bonus 2 ---------------------------------------------------------
// Refactor to pointfree. Hint: you can use `_.flip`
var fastestCar = function(cars) {
  var
    sorted  = _.sortBy(_.prop('horsepower'), cars),
    fastest = _.last(sorted);

  return fastest.name + ' is the fastest';
};


//-- Exports ----------------------------------------------------------
module.exports = {
  isLastInStock:isLastInStock,
  nameOfFirstCar:nameOfFirstCar,
  fastestCar:fastestCar,
  averageDollarValue:averageDollarValue,
  availablePrices:availablePrices,
  sanitizeNames:sanitizeNames
};
