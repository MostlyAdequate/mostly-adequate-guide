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
var isLastInStock = _.compose(_.prop('in_stock'), _.last);

//-- Exercise 2 -------------------------------------------------------
var nameOfFirstCar = _.compose(_.prop('name'), _.head);

//-- Exercise 3 -------------------------------------------------------
var
  _average = function(xs) { return _.reduce(_.add, 0, xs) / xs.length; },
  averageDollarValue = _.compose(_average, _.map(_.prop('dollar_value')));

//-- Exercise 4 -------------------------------------------------------
var
  _underscore   = _.replace(/\W+/g, '_'),
  sanitizeNames = _.map(_.compose(_underscore, _.toLower, _.prop('name')));

//-- Bonus 1 ---------------------------------------------------------
var
  formatPrice = _.compose(formatMoney, _.prop('dollar_value')),
  availablePrices =
    _.compose(_.join(', '), _.map(formatPrice), _.filter(_.prop('in_stock')));

//-- Bonus 2 ----------------------------------------------------------
var
  append     = _.flip(_.concat),
  fastestCar = // :: [Car] -> String
    _.compose(append(' is the fastest'),
              _.prop('name'),
              _.last,
              _.sortBy(_.prop('horsepower')));


//-- Exports ----------------------------------------------------------
module.exports = {
  isLastInStock:isLastInStock,
  nameOfFirstCar:nameOfFirstCar,
  fastestCar:fastestCar,
  averageDollarValue:averageDollarValue,
  availablePrices:availablePrices,
  sanitizeNames:sanitizeNames
};
