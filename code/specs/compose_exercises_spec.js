const
  {CARS} = require('../mock.cars'),
  {deepEqual,equal} = require("chai").assert;

module.exports = E =>
  describe("Compose Exercises", function(){
    it('Exercise 1', function(){
      equal(E.isLastInStock(CARS), false);
    });

    it('Exercise 2', function(){
      equal(E.nameOfFirstCar(CARS), "Ferrari FF");
    });

    it('Exercise 3', function(){
      equal(E.averageDollarValue(CARS), 790700);
    });

    it('Exercise 4', function(){
      deepEqual(E.sanitizeNames(CARS), ['ferrari_ff', 'spyker_c12_zagato', 'jaguar_xkr_s', 'audi_r8', 'aston_martin_one_77', 'pagani_huayra']);
    });

    it('Bonus 1', function(){
      equal(E.availablePrices(CARS), '$700,000.00, $1,850,000.00');
    });

    it('Bonus 2', function(){
      equal(E.fastestCar(CARS), 'Aston Martin One-77 is the fastest');
    });
  });
