const
  /*
    data CAR =
      {name         :: String
      ,horsepower   :: Number
      ,dollar_value :: Number
      ,in_stock     :: Bool}
  */
  {CARS}        = require('../../../mock.cars'),
  {formatMoney} = require('accounting'),
  {add,compose,concat,prop,last,head,map,filter,flip,sortBy,replace,toLower,join,reduce} = require('ramda');

//-- Exercise 1 -------------------------------------------------------
const isLastInStock = compose(prop('in_stock'), last);


//-- Exercise 2 -------------------------------------------------------
const nameOfFirstCar = compose(prop('name'), head);


//-- Exercise 3 -------------------------------------------------------
// Use the helper function `_average` to refactor `averageDollarValue` as a composition
const _average = xs => reduce(add, 0, xs) / xs.length;

const averageDollarValue = compose(_average, map(prop('dollar_value')));


//-- Exercise 4 -------------------------------------------------------
// Write a function: `sanitizeNames` using `compose` that takes an array of cars and returns a list of lowercase and underscored names: e.g: sanitizeNames([{name: "Ferrari FF"}]) => ["ferrari_ff"].
const _underscore = replace(/\W+/g, '_');

const sanitizeNames = map(compose(_underscore, toLower, prop('name')));


//-- Bonus 1 -------------------------------------------------------===
// Refactor `availablePrices` with `compose`.
const
  formatPrice = compose(formatMoney, prop('dollar_value')),
  availablePrices =
    compose(join(', '), map(formatPrice), filter(prop('in_stock')));


//-- Bonus 2 -------------------------------------------------------===
// Refactor to pointfree. Hint: you can use `flip`
const
  append     = flip(concat),
  fastestCar = // :: [Car] -> String
    compose(append(' is the fastest')
           ,prop('name')
           ,last
           ,sortBy(prop('horsepower')));


module.exports = {
  isLastInStock: isLastInStock,
  nameOfFirstCar: nameOfFirstCar,
  fastestCar: fastestCar,
  averageDollarValue: averageDollarValue,
  availablePrices: availablePrices,
  sanitizeNames: sanitizeNames
};
