'use strict'; // eslint-disable-line strict, lines-around-directive

/* eslint-disable prefer-arrow-callback */

/* ---------- General Purpose ---------- */


function namedAs(value, fn) {
  Object.defineProperty(fn, 'name', { value });
  return fn;
}


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


if (typeof assert === 'function') {
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
}

const add = curry(function add(a, b) { return a + b; });

const concat = curry(function concat(a, b) { return a.concat(b); });

const filter = curry(function filter(fn, xs) { return xs.filter(fn); });

const flip = curry(function flip(fn, a, b) { return fn(b, a); });

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
  keepHighest.calledBy = keepHighest.caller;
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

/* ---------- Exports ---------- */

if (typeof module === 'object') {
  module.exports = {
    compose,
    curry,

    add,
    filter,
    flip,
    flip,
    last,
    map,
    match,
    prop,
    reduce,
    sortBy,
    split,

    keepHighest,

    cars,
    average,
  };
}
