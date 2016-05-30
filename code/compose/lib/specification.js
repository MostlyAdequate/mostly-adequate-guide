const
  {CARS}                      = require('./mock.cars'),
  {assert: {deepEqual,equal}} = require("chai");

const
  ex4 =
    ['ferrari_ff'
    ,'spyker_c12_zagato'
    ,'jaguar_xkr_s'
    ,'audi_r8'
    ,'aston_martin_one_77'
    ,'pagani_huayra'],
  b1 =
    '$700,000.00, $1,850,000.00',
  b2 =
    'Aston Martin One-77 is the fastest';

module.exports = (title,E) =>
  describe(title, () => {
    it('Exercise 1', () => equal(E.isLastInStock(CARS), false));
    it('Exercise 2', () => equal(E.nameOfFirstCar(CARS), "Ferrari FF"));
    it('Exercise 3', () => equal(E.averageDollarValue(CARS), 790700));
    it('Exercise 4', () => deepEqual(E.sanitizeNames(CARS), ex4));
    it('Bonus 1',    () => equal(E.availablePrices(CARS), b1));
    it('Bonus 2',    () => equal(E.fastestCar(CARS), b2));
  });
