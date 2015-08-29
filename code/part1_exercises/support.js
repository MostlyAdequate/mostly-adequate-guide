//var curry = require('ramda').curry;
//
//
//
//
function inspect(x) {
  return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
}

function inspectFn(f) {
  return (f.name) ? f.name : f.toString();
}

function inspectArgs(args) {
  return args.reduce(function(acc, x){
    return acc += inspect(x);
  }, '(') + ')';
}

function curry(fx) {
  var arity = fx.length;

  return function f1() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length >= arity) {
      return fx.apply(null, args);
    }
    else {
      var f2 = function f2() {
        var args2 = Array.prototype.slice.call(arguments, 0);
        return f1.apply(null, args.concat(args2)); 
      }
      f2.toString = function() {
        return inspectFn(fx) + inspectArgs(args);
      }
      return f2;
    }
  };
}

compose = function() {
  var fns = toArray(arguments),
      arglen = fns.length;

  return function(){
    for(var i=arglen;--i>=0;) {
      var fn = fns[i]
        , args = fn.length ? Array.prototype.slice.call(arguments, 0, fn.length) : arguments
        , next_args = Array.prototype.slice.call(arguments, (fn.length || 1)); //not right with *args
      next_args.unshift(fn.apply(this,args));
      arguments = next_args;
    }
    return arguments[0];
  }
}

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

map = curry(function map(f, xs) {
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
