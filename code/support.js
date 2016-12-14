var
  _     = require('ramda'),
  curry = _.curry,
  Task  = require('data.task');

//-- Identity ---------------------------------------------------------
Identity = function(x) {
  this.__value = x;
};
Identity.of = function(x) { return new Identity(x); };
Identity.prototype.map = function(f) {
  return Identity.of(f(this.__value));
};
Identity.prototype.inspect = function() {
  return 'Identity('+inspect(this.__value)+')';
};

//-- Maybe ------------------------------------------------------------
Maybe = function(x) {
  this.__value = x;
};
Maybe.of = function(x) {
  return new Maybe(x);
};
Maybe.prototype.isNothing = function(f) {
  return (this.__value === null || this.__value === undefined);
};
Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
};
Maybe.prototype.chain = function(f) {
  return this.map(f).join();
};
Maybe.prototype.ap = function(other) {
  return this.isNothing() ? Maybe.of(null) : other.map(this.__value);
};
Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of(null) : this.__value;
}
Maybe.prototype.inspect = function() {
  return 'Maybe('+inspect(this.__value)+')';
}

//-- Either -----------------------------------------------------------
Either = function() {};
Either.of = function(x) {
  return new Right(x);
}
Left = function(x) {
  this.__value = x;
}
// TODO: remove this nonsense
Left.of = function(x) {
  return new Left(x);
}
Left.prototype.map = function(f) { return this; }
Left.prototype.ap = function(other) { return this; }
Left.prototype.join = function() { return this; }
Left.prototype.chain = function() { return this; }
Left.prototype.inspect = function() {
  return 'Left('+inspect(this.__value)+')';
}

Right = function(x) {
  this.__value = x;
}
// TODO: remove in favor of Either.of
Right.of = function(x) {
  return new Right(x);
}
Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}
Right.prototype.join = function() {
  return this.__value;
}
Right.prototype.chain = function(f) {
  return f(this.__value);
}
Right.prototype.ap = function(other) {
  return this.chain(function(f) {
    return other.map(f);
  });
}
Right.prototype.join = function() {
  return this.__value;
}
Right.prototype.chain = function(f) {
  return f(this.__value);
}
Right.prototype.inspect = function() {
  return 'Right('+inspect(this.__value)+')';
}

either = curry(function(f, g, e) {
  switch(e.constructor) {
    case Left: return f(e.__value);
    case Right: return g(e.__value);
  }
});

//-- IO ---------------------------------------------------------------
IO = function(f) {
  this.unsafePerformIO = f;
}
IO.of = function(x) {
  return new IO(function() {
    return x;
  });
}
IO.prototype.map = function(f) {
  return new IO(_.compose(f, this.unsafePerformIO));
}
IO.prototype.join = function() {
  return this.unsafePerformIO();
}
IO.prototype.chain = function(f) {
  return this.map(f).join();
}
IO.prototype.ap = function(a) {
  return this.chain(function(f) {
    return a.map(f);
  });
}
IO.prototype.inspect = function() {
  return 'IO('+inspect(this.unsafePerformIO)+')';
}

unsafePerformIO = function(x) { return x.unsafePerformIO(); }

//-- Util -------------------------------------------------------------
var
  chain = curry(function(f,m){
    return m.map(f).join(); // or compose(join, map(f))(m)
  }),
  liftA2 = curry(function(f,a1,a2)    { return a1.map(f).ap(a2);        }),
  liftA3 = curry(function(f,a1,a2,a3) { return a1.map(f).ap(a2).ap(a3); });


// Extend `Task` so it work with `chain`
Task.prototype.join = function(){ return this.chain(_.identity); }

//-- Exercise Util ----------------------------------------------------
var
//getPost :: Int -> Task({id: Int, title: String})
  getPost = function (i) {
    var response = {id:i,title:'Love them tasks'};

    return new Task(function(reject,resolve) {
      setTimeout(resolve,5,response)
    });
  },
  getComments = function getComments(id) {
    var response = [{post_id:id,body:'This book should be illegal'}
                   ,{post_id:id,body:'Monads are like space burritos'}];

    return new Task(function(reject,resolve) {
      setTimeout(resolve,5,response);
    });
  };

module.exports = {
  unsafePerformIO,
  liftA2,
  liftA3,
  chain,
  Identity,
  IO,
  Maybe,
  Right,
  Left,
  either,
  getPost,
  getComments
}
