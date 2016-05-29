const
  {identity,compose,curry} = require('ramda'),
  Task = require('data.task');

// const
//   // inspect     = x => (x && x.inspect)? x.inspect() : x,
//   inspectFn   = f => f.name? f.name : f.toString(),
//   inspectArgs = args => args.reduce((acc,x) => acc += inspect(x),'(') + ')'
//   inspect     = x => typeof x === 'function'? inspectFn(x) : inspectArgs(x);

const
  getPost = id => new Task((rej, res) =>
    setTimeout(() => res({id, title: 'Love them tasks'}), 300)),
  getComments = post_id => new Task((rej, res) =>
    setTimeout(() => res(["This book should be illegal"
                         ,"Monads are like space burritos"]), 300));


//-- Identity ---------------------------------------------------------
class Identity {
  constructor(x) { this.__value = x;                            }
  static of(x)   { return new Identity(x);                      }
  map(f)         { return Identity.of(f(this.__value));         }
  inspect()      { return `Identity(${inspect(this.__value)})`; }
}

//-- Maybe ------------------------------------------------------------
class Maybe {
  constructor(x) { this.__value = x; }
  static of(x)   { return new Maybe(x); }
  isNothing(f)   { return (this.__value === null || this.__value === undefined); }
  map(f)         { return Maybe.of(this.isNothing()? null : f(this.__value)) }
  ap(other)      { return this.isNothing()? Maybe.of(null) : other.map(this.__value); }
  chain(f)  { return this.map(f).join(); }
  join()    { return this.isNothing()? Maybe.of(null) : this.__value; }
  inspect() { return `Maybe(${inspect(this.__value)})`; }
}

//-- Either -----------------------------------------------------------
Either    = function() {};
Either.of = x => new Right(x);

Left = function(x) { this.__value = x; }
// TODO: remove this nonsense
Left.of = x => new Left(x);
Left.prototype.map     = function() { return this; };
Left.prototype.ap      = function() { return this; };
Left.prototype.join    = function() { return this; };
Left.prototype.chain   = function() { return this; };
Left.prototype.inspect = function() { return `Left(${inspect(this.__value)})`;};

// TODO: remove in favor of Either.of
Right = function(x) { this.__value = x; }
Right.of = x => new Right(x);
Right.prototype.map   = function(f) { return Right.of(f(this.__value)); };
Right.prototype.join  = function()  { return this.__value; };
Right.prototype.chain = function(f) { return f(this.__value); }
Right.prototype.ap = function(other) { return this.chain((f) => other.map(f));}
Right.prototype.join = function() { return this.__value; }
Right.prototype.chain = function(f) { return f(this.__value); }
Right.prototype.inspect = function() {
  return `Right(${inspect(this.__value)})`;
}

//-- IO ---------------------------------------------------------------
class IO {
  constructor(f) { this.unsafePerformIO = f; }
  static of(x)   { return new IO(() => x); }
  map(f)         { return new IO(compose(f, this.unsafePerformIO)); }
  join()         { return this.unsafePerformIO(); }
  chain(f)       { return this.map(f).join(); }
  ap(a)          { return this.chain((f) => a.map(f)); }
}

unsafePerformIO = x => x.unsafePerformIO();

either = curry(function(f, g, e) {
  switch(e.constructor) {
    case Left: return f(e.__value);
    case Right: return g(e.__value);
  }
});

chain = curry((f, m) => m.map(f).join()); // or compose(join, map(f))(m)

liftA2 = curry((f, a1, a2)     => a1.map(f).ap(a2));
liftA3 = curry((f, a1, a2, a3) => a1.map(f).ap(a2).ap(a3));

Task.prototype.join = function(){ return this.chain(identity); }

module.exports = {
  Identity,
  IO,
  Maybe,
  getPost,
  getComments
}
