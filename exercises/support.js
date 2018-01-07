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
    switch (typeof t) {
      case 'string':
        return `'${t}'`;
      case 'object': {
        const ts = Object.keys(t).map(k => [k, inspect(t[k])]);
        return `{${ts.map(kv => kv.join(': ')).join(', ')}}`;
      }
      default:
        return String(t);
    }
  }

  function inspectArgs(args) {
    return Array.isArray(args) ? `[${args.map(inspect).join(', ')}]` : inspectTerm(args);
  }

  return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
}


/* eslint-disable no-param-reassign */
function withSpyOn(prop, obj, fn) {
  const orig = obj[prop];
  let called = false;
  obj[prop] = function spy(...args) {
    called = true;
    return orig.call(this, ...args);
  };
  fn();
  obj[prop] = orig;
  return called;
}
/* eslint-enable no-param-reassign */


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

  traverse(of, fn) {
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

  sequence(of) {
    return this.traverse(of, x => x);
  }

  traverse(of, fn) {
    fn(this.$value).map(Either.of);
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

  sequence(of) {
    return this.traverse(of, x => x);
  }

  traverse(of, fn) {
    return fn(this.$value).map(Identity.of);
  }
}

class IO {
  static of(x) {
    return new IO(() => x);
  }

  constructor(io) {
    assert(
      typeof io === 'function',
      'invalid `io` operation given to IO constructor. Use `IO.of` if you want to lift a value in a default minimal IO context.',
    );

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


class Map {
  static of(x) {
    return new Map(x);
  }

  constructor(x) {
    this.$value = x;
  }

  inspect() {
    return `Map(${inspect(this.$value)})`;
  }

  insert(k, v) {
    const singleton = {};
    singleton[k] = v;
    return Map.of(Object.assign({}, this.$value, singleton));
  }

  reduce(fn, zero) {
    return this.reduceWithKeys((acc, _, k) => fn(acc, k), zero);
  }

  reduceWithKeys(fn, zero) {
    return Object.keys(this.$value)
      .reduce((acc, k) => fn(acc, this.$value[k], k), zero);
  }

  map(fn) {
    return new Map(this.reduceWithKeys((obj, v, k) => {
      obj[k] = fn(v); // eslint-disable-line no-param-reassign
      return obj;
    }, {}));
  }

  sequence(of) {
    return this.traverse(of, x => x);
  }

  traverse(of, fn) {
    return this.reduceWithKeys(
      (f, a, k) => fn(a).map(b => m => m.insert(k, b)).ap(f),
      of(Map.of({})),
    );
  }
}


class List {
  static of(xs) {
    return new List(xs);
  }

  constructor(xs) {
    this.$value = xs;
  }

  concat(x) {
    return List.of(this.$value.concat(x));
  }

  inspect() {
    return `List(${inspect(this.$value)})`;
  }

  map(fn) {
    return List.of(this.$value.map(fn));
  }

  sequence(of) {
    return this.traverse(of, x => x);
  }

  traverse(of, fn) {
    return this.$value.reduce(
      (f, a) => fn(a).map(b => bs => bs.concat(b)).ap(f),
      of(List.of([])),
    );
  }
}


class Maybe {
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  get isJust() {
    return !this.isNothing;
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
    this.traverse(of, x => x);
  }

  traverse(of, fn) {
    return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of);
  }
}


class Task {
  constructor(fork) {
    assert(
      typeof fork === 'function',
      'invalid `fork` operation given to Task constructor. Use `Task.of` if you want to lift a value in a default minimal Task context.',
    );

    this.fork = fork;
  }

  static of(x) {
    return new Task((_, resolve) => resolve(x));
  }

  static rejected(x) {
    return new Task((reject, _) => reject(x));
  }

  ap(f) {
    return this.chain(fn => f.map(fn));
  }

  chain(fn) {
    return new Task((reject, resolve) => this.fork(reject, x => fn(x).fork(reject, resolve)));
  }

  inspect() { // eslint-disable-line class-methods-use-this
    return 'Task(?)';
  }

  join() {
    return this.chain(x => x);
  }

  map(fn) {
    return new Task((reject, resolve) => this.fork(reject, compose(resolve, fn)));
  }
}

const identity = function identity(x) { return x; };

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

const nothing = function nothing() { return Maybe.of(null); };

const reject = function reject(x) { return Task.rejected(x); };

const chain = curry(function chain(fn, m) { return m.chain(fn); });

const join = function join(m) { return m.join(); };

const map = curry(function map(fn, xs) { return xs.map(fn); });

const sequence = curry(function sequence(of, x) { return x.sequence(of); });

const traverse = curry(function traverse(of, fn, x) { return x.traverse(of, fn); });

const unsafePerformIO = function unsafePerformIO(io) { return io.unsafePerformIO(); };

const liftA2 = curry(function liftA2(f, a1, a2) { return a1.map(f).ap(a2); });

const liftA3 = curry(function liftA3(f, a1, a2, a3) { return a1.map(f).ap(a2).ap(a3); });

const liftA4 = curry(function liftA4(f, a1, a2, a3, a4) { return a1.map(f).ap(a2).ap(a3).ap(a4); });

const always = curry(function always(a, b) { return a; });


/* ---------- Pointfree Classic Utilities ---------- */

const add = curry(function add(a, b) { return a + b; });

const concat = curry(function concat(a, b) { return a.concat(b); });

const filter = curry(function filter(fn, xs) { return xs.filter(fn); });

const flip = curry(function flip(fn, a, b) { return fn(b, a); });

const forEach = curry(function forEach(fn, xs) { xs.forEach(fn); });

const intercalate = curry(function intercalate(str, xs) { return xs.join(str); });

const head = function head(xs) { return xs[0]; };

const last = function last(xs) { return xs[xs.length - 1]; };

const match = curry(function match(re, str) { return str.match(re); });

const prop = curry(function prop(p, obj) { return obj[p]; });

const reduce = curry(function reduce(fn, acc, xs) {
  return xs.reduce(
    function $reduceIterator($acc, $x) { return fn($acc, $x); },
    acc,
  );
});

const safeHead = namedAs('safeHead', compose(Maybe.of, head));

const safeProp = curry(function safeProp(p, obj) { return Maybe.of(prop(p, obj)); });

const sortBy = curry(function sortBy(fn, xs) {
  return xs.sort((a, b) => {
    if (fn(a) === fn(b)) {
      return 0;
    }

    return fn(a) > fn(b) ? 1 : -1;
  });
});

const split = curry(function split(s, str) { return str.split(s); });

const take = curry(function take(n, xs) { return xs.slice(0, n); });


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

const albert = {
  id: 1,
  active: true,
  name: 'Albert',
  address: {
    street: {
      number: 22,
      name: 'Walnut St',
    },
  },
};

const gary = {
  id: 2,
  active: false,
  name: 'Gary',
  address: {
    street: {
      number: 14,
    },
  },
};

const theresa = {
  id: 3,
  active: true,
  name: 'Theresa',
};

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


/* ---------- Chapter 9 ---------- */

const getFile = function getFile() { return IO.of('/home/mostly-adequate/ch9.md'); };

const pureLog = function pureLog(str) { return new IO(() => str); };

const addToMailingList = function addToMailingList(email) { return IO.of([email]); };

const emailBlast = function emailBlast(list) { return IO.of(list.join(',')); };

const validateEmail = function validateEmail(x) {
  return /\S+@\S+\.\S+/.test(x)
    ? Either.of(x)
    : left('invalid email');
};


/* ---------- Chapter 10 ---------- */

const localStorage = { player1: albert, player2: theresa };

const game = curry(function game(p1, p2) { return `${p1.name} vs ${p2.name}`; });

const getFromCache = function getFromCache(x) { return new IO(() => localStorage[x]); };


/* ---------- Chapter 11 ---------- */

const findUserById = function findUserById(id) {
  switch (id) {
    case 1:
      return Task.of(Either.of(albert));

    case 2:
      return Task.of(Either.of(gary));

    case 3:
      return Task.of(Either.of(theresa));

    default:
      return Task.of(left('not found'));
  }
};

const eitherToTask = namedAs('eitherToTask', either(Task.rejected, Task.of));


/* ---------- Chapter 12 ---------- */

const httpGet = function httpGet(route) { return Task.of(`json for ${route}`); };

const routes = Map.of({
  '/': '/',
  '/about': '/about',
});

const validate = function validate(player) {
  return player.name
    ? Either.of(player)
    : left('must have name');
};

const readdir = function readdir(dir) {
  return Task.of(['file1', 'file2', 'file3']);
};

const readfile = curry(function readfile(encoding, file) {
  return Task.of(`content of ${file} (${encoding})`);
});


/* ---------- Exports ---------- */

if (typeof module === 'object') {
  module.exports = {
    // Utils
    withSpyOn,

    // Essential FP helpers
    always,
    chain,
    compose,
    curry,
    either,
    identity,
    join,
    left,
    liftA2,
    liftA3,
    liftA4,
    map,
    maybe,
    nothing,
    reject,
    sequence,
    traverse,
    unsafePerformIO,

    // Algebraic Data Structures
    Either,
    IO,
    Identity,
    Left,
    List,
    Map,
    Maybe,
    Right,
    Task,

    // Currified version of 'standard' functions
    add,
    concat,
    filter,
    flip,
    forEach,
    head,
    intercalate,
    last,
    match,
    prop,
    reduce,
    safeHead,
    safeProp,
    sortBy,
    split,
    take,

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

    // Chapter 09
    getFile,
    pureLog,
    addToMailingList,
    emailBlast,
    validateEmail,

    // Chapter 10
    localStorage,
    getFromCache,
    game,

    // Chapter 11
    findUserById,
    eitherToTask,

    // Chapter 12
    httpGet,
    routes,
    validate,
    readdir,
    readfile,
  };
}
