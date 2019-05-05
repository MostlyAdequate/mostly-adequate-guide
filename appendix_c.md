# Appendix C: Pointfree Utilities

In this appendix, you'll find pointfree versions of rather classic JavaScript functions
described in the book. All of the following functions are seemingly available in exercises, as
part of the global context. Keep in mind that these implementations may not be the fastest or
the most efficient implementation out there; they *solely serve an educational purpose*.

In order to find functions that are more production-ready, have a peek at
[ramda](https://ramdajs.com/), [lodash](https://lodash.com/), or [folktale](http://folktale.origamitower.com/).

Note that functions refer to the `curry` & `compose` functions defined in [Appendix A](./appendix_a.md)

## add 

```js
// add :: Number -> Number -> Number
const add = curry((a, b) => a + b);
```

## append

```js
// append :: String -> String -> String
const append = flip(concat);
```

## chain

```js
// chain :: Monad m => (a -> m b) -> m a -> m b
const chain = curry((fn, m) => m.chain(fn));
```

## concat

```js
// concat :: String -> String -> String
const concat = curry((a, b) => a.concat(b));
```

## eq

```js
// eq :: Eq a => a -> a -> Boolean
const eq = curry((a, b) => a === b);
```

## filter

```js
// filter :: (a -> Boolean) -> [a] -> [a]
const filter = curry((fn, xs) => xs.filter(fn));
```

## flip

```js
// flip :: (a -> b -> c) -> b -> a -> c
const flip = curry((fn, a, b) => fn(b, a));
```

## forEach 

```js
// forEach :: (a -> ()) -> [a] -> ()
const forEach = curry((fn, xs) => xs.forEach(fn));
```

## head

```js
// head :: [a] -> a
const head = xs => xs[0];
```

## intercalate

```js
// intercalate :: String -> [String] -> String
const intercalate = curry((str, xs) => xs.join(str));
```

## join

```js
// join :: Monad m => m (m a) -> m a
const join = m => m.join();
```

## last

```js
// last :: [a] -> a
const last = xs => xs[xs.length - 1];
```

## map

```js
// map :: Functor f => (a -> b) -> f a -> f b
const map = curry((fn, f) => f.map(fn));
```

## match

```js
// match :: RegExp -> String -> Boolean
const match = curry((re, str) => re.test(str));
```

## prop 

```js
// prop :: String -> Object -> a
const prop = curry((p, obj) => obj[p]);
```

## reduce

```js
// reduce :: (b -> a -> b) -> b -> [a] -> b
const reduce = curry((fn, zero, xs) => xs.reduce(fn, zero));
```

## replace

```js
// replace :: RegExp -> String -> String -> String
const replace = curry((re, rpl, str) => str.replace(re, rpl));
```

## reverse

```js
// reverse :: [a] -> [a]
const reverse = x => (Array.isArray(x) ? x.reverse() : x.split('').reverse().join(''));
```

## safeHead

```js
// safeHead :: [a] -> Maybe a
const safeHead = compose(Maybe.of, head);
```

## safeLast

```js
// safeLast :: [a] -> Maybe a
const safeLast = compose(Maybe.of, last);
```

## safeProp

```js
// safeProp :: String -> Object -> Maybe a
const safeProp = curry((p, obj) => compose(Maybe.of, prop(p))(obj));
```

## sequence

```js
// sequence :: (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
const sequence = curry((of, f) => f.sequence(of));
```

## sortBy

```js
// sortBy :: Ord b => (a -> b) -> [a] -> [a]
const sortBy = curry((fn, xs) => xs.sort((a, b) => {
  if (fn(a) === fn(b)) {
    return 0;
  }

  return fn(a) > fn(b) ? 1 : -1;
}));
```

## split

```js
// split :: String -> String -> [String]
const split = curry((sep, str) => str.split(sep));
```

## take

```js
// take :: Number -> [a] -> [a]
const take = curry((n, xs) => xs.slice(0, n));
```

## toLowerCase

```js
// toLowerCase :: String -> String
const toLowerCase = s => s.toLowerCase();
```

## toString

```js
// toString :: a -> String
const toString = String;
```

## toUpperCase

```js
// toUpperCase :: String -> String
const toUpperCase = s => s.toUpperCase();
```

## traverse

```js
// traverse :: (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
const traverse = curry((of, fn, f) => f.traverse(of, fn));
```

## unsafePerformIO

```js
// unsafePerformIO :: IO a -> a
const unsafePerformIO = io => io.unsafePerformIO();
```
