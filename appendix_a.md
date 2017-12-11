# Appendix A: Functions Support

In this appendix, you'll find some basic JavaScript implementations of various functions
described in the book. Keep in mind that these implementations may not be the fastest or the
most efficient implementation out there; they *solely serve an educational purpose*.

In order to find functions that are more production-ready, have a peak at
[ramda](http://ramdajs.com/), [lodash](https://lodash.com/), or [folktale](http://folktale.github.io/).

Note that some functions also refer to algebraic structures defined in the [Appendix B](./appendix_b.md)

## chain

```hs
chain :: Monad m => (a -> m b) -> m a -> m b
```

```js
const chain = f => compose(join, map(f))
```

## compose

```hs
compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
```

```js
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
```

## curry

```hs
curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
```

```js
function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}
```

## either

```hs
either :: (a -> c) -> (b -> c) -> Either a b -> c
```

```js
const either = curry((f, g, e) => {
  if (e.isLeft) {
    return f(e.$value);
  }

  return g(e.$value);
});
```

## inspect

```hs
inspect :: a -> String
```

```js
function inspect(x) {
  if (x && typeof x.inspect === 'function') {
    return x.inspect();
  }

  function inspectFn(f) {
    return f.name ? f.name : f.toString();
  }

  function inspectArgs(args) {
    const str = args.reduce((acc, x) => `${acc}, ${inspect(x)}`, '');
    return `(${str})`;
  }

  return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
}
```

## join

```hs
join :: Monad m => m (m a) -> m a
```

```js
const join = m => m.join();
```

## liftA2

```hs
liftA2 :: (Applicative f) => (a1 -> a2 -> b) -> f a1 -> f a2 -> f b
```

```js
const liftA2 = curry((fn, a1, a2) => a1.map(fn).ap(a2));
```

## liftA3

```hs
liftA3 :: (Applicative f) => (a1 -> a2 -> a3 -> b) -> f a1 -> f a2 -> f a3 -> f b
```

```js
const liftA3 = curry((fn, a1, a2, a3) => a1.map(fn).ap(a2).ap(a3))
```

## maybe

```hs
maybe :: b -> (a -> b) -> Maybe a -> b
```

```js
const maybe = curry((v, f, m) => {
  if (m.isNothing) {
    return v;
  }

  return f(m.$value);
});
```
