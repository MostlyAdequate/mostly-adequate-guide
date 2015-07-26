require('../part1_exercises/support');
var _ = require('ramda');
var Task = require('data.task');
var curry = _.curry;

inspect = function(x) {
  return (x && x.inspect) ? x.inspect() : x;
};

toUpperCase = function(x) {
  return x.toUpperCase();
};

// Identity
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

// Maybe
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

Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of(null) : this.__value;
}

Maybe.prototype.inspect = function() {
  return 'Maybe('+inspect(this.__value)+')';
}


// Either
Either = function() {};
Either.of = function(x) {
  return new Right(x);
}

Left = function(x) {
  this.__value = x;
}

Left.of = function(x) {
  return new Left(x);
}

Left.prototype.map = function(f) { return this; }
Left.prototype.join = function() { return this; } 
Left.prototype.chain = function() { return this; }
Left.prototype.inspect = function() {
  return 'Left('+inspect(this.__value)+')';
}


Right = function(x) {
  this.__value = x;
}

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

Right.prototype.inspect = function() {
  return 'Right('+inspect(this.__value)+')';
}

// IO
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

IO.prototype.inspect = function() {
  return 'IO('+inspect(this.unsafePerformIO)+')';
}

unsafePerformIO = function(x) { return x.unsafePerformIO(); }

either = curry(function(f, g, e) {
  switch(e.constructor) {
    case Left: return f(e.__value);
    case Right: return g(e.__value);
  }
});

// overwriting join from pt 1
join = function(m){ return m.join(); };

chain = curry(function(f, m){
  return m.map(f).join(); // or compose(join, map(f))(m)
});

Task.prototype.join = function(){ return this.chain(_.identity); }
