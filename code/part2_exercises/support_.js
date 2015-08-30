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

Maybe.prototype.isNothing = function() {
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


// Either
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

Right.prototype.chain = function(f) {
  return this.map(f).join();
};

Right.prototype.ap = function(other) {
  return this.chain(function(f) {
    return other.map(f);
  });
};

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

IO.prototype.chain = function(f) {
  return this.map(f).join();
};

IO.prototype.ap = function(a) {
  return this.chain(function(f) {
    return a.map(f);
  });
};

IO.prototype.join = function() {
  return this.unsafePerformIO();
}

IO.prototype.inspect = function() {
  return 'IO('+inspect(this.__value)+')';
}

unsafePerformIO = function(x) { return x.unsafePerformIO(); }

Task.prototype.join = function(){ return this.chain(_.identity); }


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

liftA2 = curry(function(f, a1, a2){
  return a1.map(f).ap(a2);
});

liftA3 = curry(function(f, a1, a2, a3){
  return a1.map(f).ap(a2).ap(a3);
});

concat = curry(function(x, y) {
  return x.concat(y);
});

mconcat = function(xs) {
  if(!xs[0]) return xs;
  return xs.reduce(concat, xs[0].empty());
};


// Enhance, enhance.
(function() {
  var _K = function(x) { return function(y) { return x; } };

  var _fmap = function(g) {
    var f = this;
    return function(x) { return g(f(x)) };
  };

  Object.defineProperty(Function.prototype, 'map',{
      value: _fmap,
      writable: true,
      configurable: true,
      enumerable: false
  });

  var _concat = function(g) {
    var f = this;
    return function() {
      return f.apply(this, arguments).concat(g.apply(this, arguments))
    }
  };

  Object.defineProperty(Function.prototype, 'concat',{
      value: _concat,
      writable: true,
      configurable: true,
      enumerable: false
  });

  var _empty = function() {
    return _K({ concat: function(g) { return g.empty().concat(g); } });
  };

  Object.defineProperty(Function.prototype, 'empty',{
      value: _empty,
      writable: true,
      configurable: true,
      enumerable: false
  });

  Object.defineProperty(Function.prototype, 'of',{
      value: _K,
      writable: true,
      configurable: true,
      enumerable: false
  });

  var _ap = function(g) {
    var f = this;
    return function(x) {
      return f(x)(g(x));
    }
  };

  Object.defineProperty(Function.prototype, 'ap',{
      value: _ap,
      writable: true,
      configurable: true,
      enumerable: false
  });


  //empty String
  Object.defineProperty(String.prototype, 'empty',{
      value: function(){ return '' },
      writable: true,
      configurable: true,
      enumerable: false
  });

  //empty Array
  Object.defineProperty(Array.prototype, 'empty',{
      value: function(){ return [] },
      writable: true,
      configurable: true,
      enumerable: false
  });
})();

