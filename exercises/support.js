'use strict'; // eslint-disable-line strict, lines-around-directive

// NOTE We keep named function here to leverage this in the `compose` function,
// and later on in the validations scripts.

/* eslint-disable prefer-arrow-callback */


/* ---------- Internals ---------- */

function namedAs(value, fn) {
  Object.defineProperty(fn, 'name', { value });
  return fn;
}


// NOTE This file is loaded by gitbook's exercises plugin. When it does, there's an
// `assert` function available in the global scope.

/* eslint-disable no-undef, global-require */
if (typeof assert !== 'function' && typeof require === 'function') {
  global.assert = require('assert');
}

assert.arrayEqual = function assertArrayEqual(actual, expected, message = 'arrayEqual') {
  if (actual.length !== expected.length) {
    throw new Error(message);
  }

  for (let i = 0; i < expected.length; i += 1) {
    if (expected[i] !== actual[i]) {
      throw new Error(message);
    }
  }
};
/* eslint-enable no-undef, global-require */


function inspect(x) {
  if (x && typeof x.inspect === 'function') {
    return x.inspect();
  }

  function inspectFn(f) {
    return f.name ? f.name : f.toString();
  }

  function inspectTerm(t) {
    return typeof t === 'string' ? `'${t}'` : String(t);
  }

  function inspectArgs(args) {
    return Array.isArray(args) ? `[${args.map(inspect).join(', ')}]` : inspectTerm(args);
  }

  return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
}


/* ---------- Essential FP Functions ---------- */

// NOTE A slightly pumped up version of `curry` which also keeps track of
// whether a function was called partially or with all its arguments at once.
// This is useful to provide insights during validation of exercises.
function curry(fn) {
  const arity = fn.length;

  return namedAs(fn.name, function $curry(...args) {
    $curry.partially = this && this.partially;

    if (args.length < arity) {
      return namedAs(fn.name, $curry.bind({ partially: true }, ...args));
    }

    return fn.call(this || { partially: false }, ...args);
  });
}


// NOTE Aslightly pumped up version of `compose` which also keeps track of the chain
// of callees. In the end, a function created with `compose` holds a `callees` variable
// with the list of all the callees' names.
// This is useful to provide insights during validation of exercises
function compose(...fns) {
  const n = fns.length;

  return function $compose(...args) {
    $compose.callees = [];

    let $args = args;

    for (let i = n - 1; i >= 0; i -= 1) {
      const fn = fns[i];
      $compose.callees.push(fn.name);
      $args = [fn.call(null, ...$args)];
    }

    return $args[0];
  };
}


/* ---------- Algebraic Data Structures ---------- */

class Either {
  static of(x) {
    return new Right(x); // eslint-disable-line no-use-before-define
  }

  constructor(x) {
    this.$value = x;
  }
}


class Left extends Either {
  get isLeft() { // eslint-disable-line class-methods-use-this
    return true;
  }

  get isRight() { // eslint-disable-line class-methods-use-this
    return false;
  }

  ap() {
    return this;
  }

  chain() {
    return this;
  }

  inspect() {
    return `Left(${inspect(this.$value)})`;
  }

  join() {
    return this;
  }

  map() {
    return this;
  }

  sequence(of) {
    return of(this);
  }
}


class Right extends Either {
  get isLeft() { // eslint-disable-line class-methods-use-this
    return false;
  }

  get isRight() { // eslint-disable-line class-methods-use-this
    return true;
  }

  ap(f) {
    return f.map(this.$value);
  }

  chain(fn) {
    return fn(this.$value);
  }

  inspect() {
    return `Right(${inspect(this.$value)})`;
  }

  join() {
    return this.$value;
  }

  map(fn) {
    return Either.of(fn(this.$value));
  }

  sequence() {
    return this.$value.map(Either.of);
  }
}


class Identity {
  static of(x) {
    return new Identity(x);
  }

  constructor(x) {
    this.$value = x;
  }

  ap(f) {
    return f.map(this.$value);
  }

  chain(fn) {
    return this.map(fn).join();
  }

  inspect() {
    return `Identity(${inspect(this.$value)})`;
  }

  join() {
    return this.$value;
  }

  map(fn) {
    return Identity.of(fn(this.$value));
  }

  sequence() {
    return this.$value.map(Identity.of);
  }
}

class IO {
  static of(x) {
    return new IO(() => x);
  }

  constructor(io) {
    if (typeof io !== 'function') {
      throw new Error('invalid `io` operation given to IO constructor. Use `IO.of` if you want to lift a value in a default minimal IO context.');
    }

    this.unsafePerformIO = io;
  }

  ap(f) {
    return this.chain(fn => f.map(fn));
  }

  chain(fn) {
    return this.map(fn).join();
  }

  inspect() {
    return `IO(${inspect(this.unsafePerformIO)})`;
  }

  join() {
    return this.unsafePerformIO();
  }

  map(fn) {
    return new IO(compose(fn, this.unsafePerformIO));
  }
}


class Maybe {
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  constructor(x) {
    this.$value = x;
  }

  ap(f) {
    return this.isNothing ? this : f.map(this.$value);
  }

  chain(fn) {
    return this.map(fn).join();
  }

  inspect() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`;
  }

  join() {
    return this.isNothing ? this : this.$value;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  sequence(of) {
    return this.isNothing ? of(this) : this.$value.map(Maybe.of);
  }
}


const either = curry(function either(f, g, e) {
  if (e.isLeft) {
    return f(e.$value);
  }

  return g(e.$value);
});


const left = function left(x) { return new Left(x); };


const maybe = curry(function maybe(v, f, m) {
  if (m.isNothing) {
    return v;
  }

  return f(m.$value);
});


/* ---------- Pointfree Classic Utilities ---------- */

const add = curry(function add(a, b) { return a + b; });

const concat = curry(function concat(a, b) { return a.concat(b); });

const filter = curry(function filter(fn, xs) { return xs.filter(fn); });

const flip = curry(function flip(fn, a, b) { return fn(b, a); });

const forEach = curry(function forEach(fn, xs) { xs.forEach(fn); });

const head = function head(xs) { return xs[0]; };

const last = function last(xs) { return xs[xs.length - 1]; };

const map = curry(function map(fn, xs) { return xs.map(fn); });

const match = curry(function match(re, str) { return str.match(re); });

const prop = curry(function prop(p, obj) { return obj[p]; });

const reduce = curry(function reduce(fn, acc, xs) {
  return xs.reduce(
    function $reduceIterator($acc, $x) { return fn($acc, $x); },
    acc,
  );
});

const safeHead = function safeHead(xs) { return Maybe.of(xs[0]); };

const safeProp = curry(function safeProp(p, obj) { return Maybe.of(obj[p]); });

const sortBy = curry(function sortBy(fn, xs) {
  return xs.sort((a, b) => {
    if (fn(a) === fn(b)) {
      return 0;
    }

    return fn(a) > fn(b) ? 1 : -1;
  });
});

const split = curry(function split(s, str) { return str.split(s); });


/* ---------- Chapter 4 ---------- */

const keepHighest = function keepHighest(x, y) {
  try {
    keepHighest.calledBy = keepHighest.caller;
  } catch (err) {
    // NOTE node.js runs in strict mode and prohibit the usage of '.caller'
    // There's a ugly hack to retrieve the caller from stack trace.
    const [, caller] = /at (\S+)/.exec(err.stack.split('\n')[2]);

    keepHighest.calledBy = namedAs(caller, () => {});
  }

  return x >= y ? x : y;
};


/* ---------- Chapter 5 ---------- */

const cars = [{
  name: 'Ferrari FF',
  horsepower: 660,
  dollar_value: 700000,
  in_stock: true,
}, {
  name: 'Spyker C12 Zagato',
  horsepower: 650,
  dollar_value: 648000,
  in_stock: false,
}, {
  name: 'Jaguar XKR-S',
  horsepower: 550,
  dollar_value: 132000,
  in_stock: true,
}, {
  name: 'Audi R8',
  horsepower: 525,
  dollar_value: 114200,
  in_stock: false,
}, {
  name: 'Aston Martin One-77',
  horsepower: 750,
  dollar_value: 1850000,
  in_stock: true,
}, {
  name: 'Pagani Huayra',
  horsepower: 700,
  dollar_value: 1300000,
  in_stock: false,
}];

const average = function average(xs) {
  return xs.reduce(add, 0) / xs.length;
};


/* ---------- Chapter 8 ---------- */

const albert = { id: 1, name: 'Albert', active: true };

const gary = { id: 2, name: 'Gary', active: false };

const theresa = { id: 3, name: 'Theresa', active: true };

const yi = { id: 4, name: 'Yi', active: true };

const showWelcome = namedAs('showWelcome', compose(concat('Welcome '), prop('name')));

const checkActive = function checkActive(user) {
  return user.active
    ? Either.of(user)
    : left('Your account is not active');
};

const save = function save(user) {
  return new IO(() => Object.assign({}, user, { saved: true }));
};

const validateUser = curry(function validateUser(validate, user) {
  return validate(user).map(_ => user); // eslint-disable-line no-unused-vars
});


/* ---------- Exports ---------- */

if (typeof module === 'object') {
  module.exports = {
    // Essential FP helpers
    compose,
    curry,
    left,
    either,
    maybe,

    // Algebraic Data Structures
    Identity,
    IO,
    Maybe,
    Either,
    Right,
    Left,

    // Currified version of 'standard' functions
    add,
    concat,
    filter,
    flip,
    forEach,
    head,
    last,
    map,
    match,
    prop,
    reduce,
    safeHead,
    safeProp,
    sortBy,
    split,

    // Chapter 04
    keepHighest,

    // Chapter 05
    cars,
    average,

    // Chapter 08
    albert,
    gary,
    theresa,
    yi,
    showWelcome,
    checkActive,
    save,
    validateUser,
  };
}
