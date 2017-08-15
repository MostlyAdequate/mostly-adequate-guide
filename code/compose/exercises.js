const
  /*
    data CAR =
      {name         :: String
      ,horsepower   :: Number
      ,dollar_value :: Number
      ,in_stock     :: Bool}
  */
  {CARS}        = require('./lib/mock.cars'),
  {formatMoney} = require('accounting'),
  {add,compose,concat,prop,last,head,map,filter,flip,sortBy,replace,toLower,join,reduce} = require('ramda');

//-- Exercise 1 -------------------------------------------------------
// use `compose` to rewrite the function below. Hint: `prop` is curried.
const isLastInStock = cars => {
  const car = last(cars);
  return prop('in_stock', car);
};


//-- Exercise 2 -------------------------------------------------------
// use `compose`, `prop` and `head` to retrieve the name of the first car
const nameOfFirstCar = undefined;


//-- Exercise 3 -------------------------------------------------------
// Use the helper function `_average` to refactor `averageDollarValue` as a composition
const _average = xs => reduce(add, 0, xs) / xs.length;

const averageDollarValue = cars => {
  const dollar_values = map(prop('dollar_value'), cars);
  return _average(dollar_values);
};


//-- Exercise 4 -------------------------------------------------------
// Write a function: `sanitizeNames` using `compose` that takes an array of cars and returns a list of lowercase and underscored names: e.g: sanitizeNames([{name: "Ferrari FF"}]) => ["ferrari_ff"].
const _underscore = replace(/\W+/g, '_');

const sanitizeNames = undefined;


//-- Bonus 1 ---------------------------------------------------------
// Refactor `availablePrices` with `compose`.
const availablePrices = cars => {
  const available_cars = filter(prop('in_stock'), cars);
  return available_cars.map(x => formatMoney(x.dollar_value)).join(', ');
};


//-- Bonus 2 ---------------------------------------------------------
// Refactor to pointfree. Hint: you can use `flip`
const fastestCar = cars => {
  const
    sorted = sortBy(prop('horsepower'),cars),
    {name} = last(sorted);

  return `${name} is the fastest`;
};


//-- Exports ----------------------------------------------------------
module.exports = {
  isLastInStock,
  nameOfFirstCar,
  fastestCar,
  averageDollarValue,
  availablePrices,
  sanitizeNames
};
