function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    $curry.partially = this.partially;

    if (args.length < arity) {
      return $curry.bind({ partially: true }, ...args);
    }

    return fn.call(this || { partially: false }, ...args);
  };
}


function compose(...fns) {
  const n = fns.length;

  return function $compose(...args) {
    let $args = args;

    for (let i = n - 1; i >= 0; i -= 1) {
      $args = [fns[i].call(null, ...$args)];
    }

    return $args[0];
  };
}

const keepHighest = function keepHighest(x, y) {
  keepHighest.calledBy = keepHighest.caller;
  return x >= y ? x : y;
};

const filter = curry((fn, xs) => xs.filter(fn));

const last = xs => xs[xs.length - 1];

const map = curry((fn, xs) => xs.map(fn));

const match = curry((re, str) => str.match(re));

const reduce = curry((fn, acc, xs) => xs.reduce(
  function $reduceIterator($acc, $x) { return fn($acc, $x); }, // eslint-disable-line prefer-arrow-callback, max-len
  acc,
));

const split = curry((s, str) => str.split(s));

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


const CARS = [
  {
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
    in_stock: false,
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
  },
];
