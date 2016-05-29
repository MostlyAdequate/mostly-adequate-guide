const
  {deepEqual}      = require("chai").assert,
  {Identity,Maybe} = require('../support');

module.exports = E =>
  describe("Functor Exercises", function(){
    it('Exercise 1', function(){
      deepEqual(Identity.of(3), E.ex1(Identity.of(2)));
    });

    it('Exercise 2', function(){
      var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
      deepEqual(Identity.of('do'), E.ex2(xs));
    });

    it('Exercise 3', function(){
      var user = { id: 2, name: "Albert" };
      deepEqual(Maybe.of('A'), E.ex3(user));
    });

    it('Exercise 4', function(){
      deepEqual(Maybe.of(4), E.ex4("4"));
    });

    it('Exercise 5', function(done){
      E.ex5(13).fork(console.log, function(res){
        deepEqual('LOVE THEM TASKS', res);
        done();
      })
    });

    it('Exercise 6', function(){
      deepEqual(Left.of('Your account is not active'), E.ex6({active: false, name: 'Gary'}));
      deepEqual(Right.of('Welcome Theresa'), E.ex6({active: true, name: 'Theresa'}));
    });

    it('Exercise 7', function(){
      deepEqual(Right.of("fpguy99"), E.ex7("fpguy99"));
      deepEqual(Left.of("You need > 3"), E.ex7("..."));
    });

    it('Exercise 8', function(){
      deepEqual("fpguy99-saved", E.ex8("fpguy99").unsafePerformIO());
      deepEqual("You need > 3", E.ex8("...").unsafePerformIO());
    });
  });
