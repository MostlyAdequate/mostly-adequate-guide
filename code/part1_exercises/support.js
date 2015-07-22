var curry = require('ramda').curry;

add = curry(function(x, y) {
    return x + y;
});

match = curry(function(what, x) {
    return x.match(what);
});

replace = curry(function(what, replacement, x) {
    return x.replace(what, replacement);
});

filter = curry(function(f, xs) {
    return xs.filter(f);
});

map = curry(function(f, xs) {
    return xs.map(f);
});

reduce = curry(function(f, a, xs) {
    return xs.reduce(f, a);
});

split = curry(function(what, x) {
    return x.split(what);
});

join = curry(function(what, x) {
    return x.join(what);
});

toUpperCase = function(x) {
    return x.toUpperCase()
};

toLowerCase = function(x) {
    return x.toLowerCase()
};
