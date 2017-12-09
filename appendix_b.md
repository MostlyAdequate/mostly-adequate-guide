# Appendix B: Algebraic Structures Support

In this appendix, you'll find some basic JavaScript implementations of various algebraic
structures described in the book. Keep in mind that these implementations may not be the fastest or the
most efficient implementation out there; they *solely serve an educational purpose*.

In order to find structures that are more production-ready, have a peak at [folktale](http://folktale.github.io/)
or [fantasy-land](https://github.com/fantasyland).

Note that some methods also refer to functions defined in the [Appendix A](./appendix_a.md)

## Either

```js
class Either {
  static of(x) {
    return new Right(x);
  }

  constructor(x) {
    this.$value = x;
  }
}

class Left extends Either {
  get isLeft() {
    return true;
  }

  get isRight() {
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
}

class Right extends Either {
  get isLeft() {
    return false;
  }

  get isRight() {
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
}
```

## Identity

```js
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
}
```

## IO

```js
class IO {
  static of(x) {
    return new IO(() => x);
  }

  constructor(fn) {
    this.unsafePerformIO = fn;
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
```

## Maybe

> Note that `Maybe` could also be defined in a similar fashion as we did for `Either` with two 
> child classes `Just` and `Nothing`. This is simply a different flavor.

```js
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
    return `Maybe(${inspect(this.$value)})`;
  }

  join() {
    return this.isNothing ? this : this.$value;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }
}
```
