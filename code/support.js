const
  {identity,compose,curry} = require('ramda'),
  Task                     = require('data.task');

//-- Identity ---------------------------------------------------------
class Identity {
  constructor (x) { this.__value = x                            ;}
  static of   (x) { return new Identity(x)                      ;}
  map         (f) { return Identity.of(f(this.__value))         ;}
  inspect     ( ) { return `Identity(${inspect(this.__value)})` ;}
};

//-- Maybe ------------------------------------------------------------
class Maybe {
  constructor    (x) { this.__value = x                                      ;}
  static of      (x) { return new Maybe(x)                                   ;}
  static inspect ( ) { return `Maybe(${inspect(this.__value)})`              ;}
  isNothing      (f) { const v=this.__value; return v===null || v===undefined;}
  map     (f) { return Maybe.of(this.isNothing()? null : f(this.__value))    ;}
  ap      (o) { return this.isNothing()? Maybe.of(null) : o.map(this.__value);}
  chain   (f) { return this.map(f).join()                                    ;}
  join    ( ) { return this.isNothing()? Maybe.of(null) : this.__value       ;}
};

//-- Either -----------------------------------------------------------
class Either {
  constructor (x) { this.__value = x                        ;}
  static of   (x) { return new Right(x)                     ;}
};
class Left extends Either {
  constructor    (x) { super(x)                                ;}
  static of      (x) { return new Left(x)                      ;}
  static inspect ( ) { return `Left(${inspect(this.__value)})` ;}
  ap             ( ) { return this                             ;}
  chain          ( ) { return this                             ;}
  join           ( ) { return this                             ;}
  map            ( ) { return this                             ;}
};
class Right extends Either {
  constructor    (x) { super(x)                                 ;}
  static of      (x) { return new Right(x)                      ;}
  static inspect ( ) { return `Right(${inspect(this.__value)})` ;}
  ap             (o) { return this.chain(f => o.map(f))         ;}
  chain          (f) { return f(this.__value)                   ;}
  join           ( ) { return this.__value                      ;}
  map            (f) { return Right.of(f(this.__value))         ;}
};

const either = curry((f,g,e) => {
  switch(e.constructor) {
    case Left: return f(e.__value);
    case Right: return g(e.__value);
  };
});

//-- IO ---------------------------------------------------------------
class IO {
  constructor (f) { this.unsafePerformIO = f                        ;}
  static of   (x) { return new IO(() => x)                          ;}
  map         (f) { return new IO(compose(f, this.unsafePerformIO)) ;}
  join        ( ) { return this.unsafePerformIO()                   ;}
  chain       (f) { return this.map(f).join()                       ;}
  ap          (a) { return this.chain(f => a.map(f))                ;}
};
const unsafePerformIO = x => x.unsafePerformIO();

//-- Util -------------------------------------------------------------
const
  chain  = curry((f, m) => m.map(f).join()), // or compose(join, map(f))(m)
  liftA2 = curry((f, a1, a2)     => a1.map(f).ap(a2)),
  liftA3 = curry((f, a1, a2, a3) => a1.map(f).ap(a2).ap(a3));

// Extend `Task` so it work with `chain`
Task.prototype.join = function(){ return this.chain(identity); }

//-- Exercise Util ----------------------------------------------------
const
  getPost = id => new Task((rej, res) =>
    setTimeout(() => res({id, title:'Love them tasks'}), 50)),
  getComments = post_id => new Task((rej, res) =>
    setTimeout(() => res([{post_id, body:'This book should be illegal'}
                         ,{post_id, body:'Monads are like space burritos'}])
              ,50));

module.exports = {
  chain, liftA2, liftA3,
  Identity,
  IO,unsafePerformIO,
  Maybe,
  Either,either,Left,Right,
  getPost,
  getComments
};
