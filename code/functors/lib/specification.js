const
  {assert: {deepEqual}}       = require("chai"),
  {Identity,Maybe,Left,Right} = require('../../support');

module.exports = (title, E) =>
  describe(title, function(){
    it('1', function(){
      deepEqual(Identity.of(3), E.ex1(Identity.of(2)));
    });

    it('2', function(){
      var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
      deepEqual(Identity.of('do'), E.ex2(xs));
    });

    it('3', function(){
      var user = { id: 2, name: "Albert" };
      deepEqual(Maybe.of('A'), E.ex3(user));
    });

    it('4', function(){
      deepEqual(Maybe.of(4), E.ex4("4"));
    });

    it('5', function(done){
      E.ex5(13).fork(console.log, function(res){
        deepEqual('LOVE THEM TASKS', res);
        done();
      })
    });

    it('6', function(){
      deepEqual(Left.of('Your account is not active'), E.ex6({active: false, name: 'Gary'}));
      deepEqual(Right.of('Welcome Theresa'), E.ex6({active: true, name: 'Theresa'}));
    });

    it('7', function(){
      deepEqual(Right.of("fpguy99"), E.ex7("fpguy99"));
      deepEqual(Left.of("You need > 3"), E.ex7("..."));
    });

    it('8', function(){
      deepEqual("fpguy99-saved", E.ex8("fpguy99").unsafePerformIO());
      deepEqual("You need > 3", E.ex8("...").unsafePerformIO());
    });
  });
