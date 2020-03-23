# Chapter 13: Monoids bring it all together

## Wild combination

In this chapter, we will examine *monoids* by way of *semigroup*. *Monoids* are the bubblegum in the hair of mathematical abstraction. They capture an idea that spans multiple disciplines, figuratively and literally bringing them all together. They are the ominous force that connects all that calculates. The oxygen in our code base, the ground on which it runs, quantum entanglement encoded.

*Monoids* are about combination. But what is combination? It can mean so many things from accumulation to concatenation to multiplication to choice, composition, ordering, even evaluation! We'll see many examples here, but we'll only tip-toe on the foothills of monoid mountain. The instances are plentiful and applications vast. The aim of this chapter is to provide a good intuition so you can make some *monoids* of your own.

## Abstracting addition

Addition has some interesting qualities I'd like to discuss. Let's have a look at it through our abstraction goggles.

For starters, it's a binary operation, that is, an operation which takes two values and returns a value, all within the same set.

```js
// a binary operation
1 + 1 = 2
```

See? Two values in the domain, one value in the codomain, all the same set - numbers, as it were. Some might say numbers are "closed under addition", meaning the type won't ever change no matter which ones get tossed into the mix. That means we can chain the operation since the result is always another number:

```js
// we can run this on any amount of numbers
1 + 7 + 5 + 4 + ...
```

In addition to that (what a calculated pun...), we have associativity which buys us the ability to group operations however we please. Incidentally, an associative, binary operation is a recipe for parallel computation because we can chunk and distribute work.

```js
// associativity
(1 + 2) + 3 = 6
1 + (2 + 3) = 6
```

Now, don't go confusing this with commutativity which allows us to rearrange the order. While that holds for addition, we're not particularly interested in that property at the moment - too specific for our abstraction needs.

Come to think of it, what properties should be in our abstract superclass anyways? What traits are specific to addition and what ones can be generalized? Are there other abstractions amidst this hierarchy or is it all one chunk? It's this kind of thinking that our mathematical forefathers applied when conceiving the interfaces in abstract algebra.

As it happens, those old school abstractionists landed on the concept of a *group* when abstracting addition. A *group* has all the bells and whistles including the concept of negative numbers. Here, we're only interested in that associative binary operator so we'll choose the less specific interface *Semigroup*. A *Semigroup* is a type with a `concat` method which acts as our associative binary operator.

Let's implement it for addition and call it `Sum`:

```js
const Sum = x => ({
  x,
  concat: other => Sum(x + other.x)
})
```

Note we `concat` with some other `Sum` and always return a `Sum`.

I've used an object factory here instead of our typical prototype ceremony, primarily because `Sum` is not *pointed* and we don't want to have to type `new`. Anyways, here it is in action:

```js
Sum(1).concat(Sum(3)) // Sum(4)
Sum(4).concat(Sum(37)) // Sum(41)
```

Just like that, we can program to an interface, not an implementation. Since this interface comes from group theory it has centuries of literature backing it up. Free docs!

Now, as mentioned, `Sum` is not *pointed*, nor a *functor*. As an exercise, go back and check the laws to see why. Okay, I'll just tell you: it can only hold a number, so `map` does not make sense here as we cannot transform the underlying value to another type. That would be a very limited `map` indeed!

So why is this useful? Well, as with any interface, we can swap out our instance to achieve different results:

```js
const Product = x => ({ x, concat: other => Product(x * other.x) })

const Min = x => ({ x, concat: other => Min(x < other.x ? x : other.x) })

const Max = x => ({ x, concat: other => Max(x > other.x ? x : other.x) })
```

This isn't limited to numbers, though. Let's see some other types:

```js
const Any = x => ({ x, concat: other => Any(x || other.x) })
const All = x => ({ x, concat: other => All(x && other.x) })

Any(false).concat(Any(true)) // Any(true)
Any(false).concat(Any(false)) // Any(false)

All(false).concat(All(true)) // All(false)
All(true).concat(All(true)) // All(true)

[1,2].concat([3,4]) // [1,2,3,4]

"miracle grow".concat("n") // miracle grown"

Map({day: 'night'}).concat(Map({white: 'nikes'})) // Map({day: 'night', white: 'nikes'})
```

If you stare at these long enough the pattern will pop out at you like a magic eye poster. It's everywhere. We're merging data structures, combining logic, building strings...it seems one can bludgeon almost any task into this combination based interface.

I've used `Map` a few times now. Pardon me if you two weren't properly introduced. `Map` simply wraps `Object` so we can embellish it with some extra methods without altering the fabric of the universe.


## All my favourite functors are semigroups.

The types we've seen so far which implement the functor interface all implement semigroup one as well. Let's look at `Identity` (the artist previously known as Container):

```js
Identity.prototype.concat = function(other) {
  return new Identity(this.__value.concat(other.__value))
}

Identity.of(Sum(4)).concat(Identity.of(Sum(1))) // Identity(Sum(5))
Identity.of(4).concat(Identity.of(1)) // TypeError: this.__value.concat is not a function
```

It is a *semigroup* if and only if its `__value` is a *semigroup*. Like a butterfingered hang glider, it is one whilst it holds one.

Other types have similar behavior:

```js
// combine with error handling
Right(Sum(2)).concat(Right(Sum(3))) // Right(Sum(5))
Right(Sum(2)).concat(Left('some error')) // Left('some error')


// combine async
Task.of([1,2]).concat(Task.of([3,4])) // Task([1,2,3,4])
```

This gets particularly useful when we stack these semigroups into a cascading combination:

```js
// formValues :: Selector -> IO (Map String String)
// validate :: Map String String -> Either Error (Map String String)

formValues('#signup').map(validate).concat(formValues('#terms').map(validate)) // IO(Right(Map({username: 'andre3000', accepted: true})))
formValues('#signup').map(validate).concat(formValues('#terms').map(validate)) // IO(Left('one must accept our totalitarian agreement'))

serverA.get('/friends').concat(serverB.get('/friends')) // Task([friend1, friend2])

// loadSetting :: String -> Task Error (Maybe (Map String Boolean))
loadSetting('email').concat(loadSetting('general')) // Task(Maybe(Map({backgroundColor: true, autoSave: false})))
```

In the top example, we've combined an `IO` holding an `Either` holding a `Map` to validate and merge form values. Next, we've hit a couple of different servers and combined their results in an async way using `Task` and `Array`. Lastly, we've stacked `Task`, `Maybe`, and `Map` to load, parse, and merge multiple settings.

These can be `chain`ed or `ap`'d, but *semigroups* capture what we'd like to do much more concisely.

This extends beyond functors. In fact, it turns out that anything made up entirely of semigroups, is itself, a semigroup: if we can concat the kit, then we can concat the caboodle.

```js
const Analytics = (clicks, path, idleTime) => ({
  clicks,
  path,
  idleTime,
  concat: other =>
    Analytics(clicks.concat(other.clicks), path.concat(other.path), idleTime.concat(other.idleTime))
})

Analytics(Sum(2), ['/home', '/about'], Right(Max(2000))).concat(Analytics(Sum(1), ['/contact'], Right(Max(1000))))
// Analytics(Sum(3), ['/home', '/about', '/contact'], Right(Max(2000)))
```

See, everything knows how to combine itself nicely. Turns out, we could do the same thing for free just by using the `Map` type:

```js
Map({clicks: Sum(2), path: ['/home', '/about'], idleTime: Right(Max(2000))}).concat(Map({clicks: Sum(1), path: ['/contact'], idleTime: Right(Max(1000))}))
// Map({clicks: Sum(3), path: ['/home', '/about', '/contact'], idleTime: Right(Max(2000))})
```

We can stack and combine as many of these as we'd like. It's simply a matter of adding another tree to the forest, or another flame to the forest fire depending on your codebase.

The default, intuitive behavior is to combine what a type is holding, however, there are cases where we ignore what's inside and combine the containers themselves. Consider a type like `Stream`:

```js
const submitStream = Stream.fromEvent('click', $('#submit'))
const enterStream = filter(x => x.key === 'Enter', Stream.fromEvent('keydown', $('#myForm')))

submitStream.concat(enterStream).map(submitForm) // Stream()
```

We can combine event streams by capturing events from both as one new stream. Alternatively, we could have combined them by insisting they hold a semigroup. In fact, there are many possible instances for each type. Consider `Task`, we can combine them by choosing the earlier or later of the two. We can always chose the first `Right` instead of short circuiting on `Left` which has the effect of ignoring errors. There is an interface called *Alternative* which implements some of these, well, alternative instances, typically focused on choice rather than cascading combination. It is worth looking into if you are in need of such functionality.

## Monoids for nothing

We were abstracting addition, but like the Babylonians, we lacked the concept of zero (there were zero mentions of it).

Zero acts as *identity* meaning any element added to `0`, will return back that very same element. Abstraction-wise, it's helpful to think of `0` as a kind of neutral or *empty* element. It's important that it act the same way on the left and right side of our binary operation:

```js
// identity
1 + 0 = 1
0 + 1 = 1
```

Let's call this concept `empty` and create a new interface with it. Like so many startups, we'll choose a heinously uninformative, yet conveniently googleable name: *Monoid*. The recipe for *Monoid* is to take any *semigroup* and add a special *identity* element. We'll implement that with an `empty` function on the type itself:

```js
Array.empty = () => []
String.empty = () => ""
Sum.empty = () => Sum(0)
Product.empty = () => Product(1)
Min.empty = () => Min(Infinity)
Max.empty = () => Max(-Infinity)
All.empty = () => All(true)
Any.empty = () => Any(false)
```

When might an empty, identity value prove useful? That's like asking why zero is useful. Like not asking anything at all...

When we have nothing else, who can we count on? Zero. How many bugs do we want? Zero. It's our tolerance for unsafe code. A fresh start. The ultimate price tag. It can annihilate everything in its path or save us in a pinch. A golden life saver and a pit of despair.

Codewise, they correspond to sensible defaults:

```js
const settings = (prefix="", overrides=[], total=0) => ...

const settings = (prefix=String.empty(), overrides=Array.empty(), total=Sum.empty()) => ...
```

Or to return a useful value when we have nothing else:

```js
sum([]) // 0
```

They are also the perfect initial value for an accumulator...

## Folding down the house

It just so happens that `concat` and `empty` fit perfectly in the first two slots of `reduce`. We can actually `reduce` an array of *semigroup*'s down by ignoring the *empty* value, but as you can see, that leads to a precarious situation:

```js
// concat :: Semigroup s => s -> s -> s
const concat = x => y => x.concat(y)

[Sum(1), Sum(2)].reduce(concat) // Sum(3)

[].reduce(concat) // TypeError: Reduce of empty array with no initial value
```

Boom goes the dynamite. Like a twisted ankle in a marathon, we have ourselves a runtime exception. JavaScript is more than happy to let us strap pistols to our sneakers before running - it is a conservative sort of language, I suppose, but it stops us dead in our tracks when the array is barren. What could it return anyhow? `NaN`, `false`, `-1`? If we were to continue on in our program, we'd like a result of the right type. It could return a `Maybe` to indicate the possibility of failure, but we can do one better.

Let's use our curried `reduce` function and make a safe version where the `empty` value is not optional. It shall henceforth be known as `fold`:

```js
// fold :: Monoid m => m -> [m] -> m
const fold = reduce(concat)
```

The initial `m` is our `empty` value - our neutral, starting point, then we take an array of `m`'s and crush them down to one beautiful diamond like value.

```js
fold(Sum.empty(), [Sum(1), Sum(2)]) // Sum(3)
fold(Sum.empty(), []) // Sum(0)

fold(Any.empty(), [Any(false), Any(true)]) // Any(true)
fold(Any.empty(), []) // Any(false)


fold(Either.of(Max.empty()), [Right(Max(3)), Right(Max(21)), Right(Max(11))]) // Right(Max(21))
fold(Either.of(Max.empty()), [Right(Max(3)), Left('error retrieving value'), Right(Max(11))]) // Left('error retrieving value')

fold(IO.of([]), ['.link', 'a'].map($)) // IO([<a>, <button class="link"/>, <a>])
```

We've provided a manual `empty` value for those last two since we can't define one on the type itself. That's totally fine. Typed languages can figure that out by themselves, but we have to pass it in here.

## Not quite a monoid

There are some *semigroups* that cannot become *monoids*, that is provide an initial value. Look at `First`:

```js
const First = x => ({ x, concat: other => First(x) })

Map({id: First(123), isPaid: Any(true), points: Sum(13)}).concat(Map({id: First(2242), isPaid: Any(false), points: Sum(1)}))
// Map({id: First(123), isPaid: Any(true), points: Sum(14)})
```

We'll merge a couple of accounts and keep the `First` id. There is no way to define an `empty` value for it. Doesn't mean it's not useful.


## Grand unifying theory

## Group theory or Category theory?

The notion of a binary operation is everywhere in abstract algebra. It is, in fact, the primary operation for a *category*. We cannot, however, model our operation in category theory without an *identity*. This is the reason we start with a semi-group from group theory, then jump to a monoid in category theory once we have *empty*.

Monoids form a single object category where the morphism is `concat`, `empty` is the identity, and composition is guaranteed.

### Composition as a monoid

Functions of type `a -> a`, where the domain is in the same set as the codomain, are called *endomorphisms*. We can make a *monoid* called `Endo` which captures this idea:

```js
const Endo = run => ({
  run,
  concat: other =>
    Endo(compose(run, other.run))
})

Endo.empty = () => Endo(identity)


// in action

// thingDownFlipAndReverse :: Endo [String] -> [String]
const thingDownFlipAndReverse = fold(Endo(() => []), [Endo(reverse), Endo(sort), Endo(append('thing down')])

thingDownFlipAndReverse.run(['let me work it', 'is it worth it?'])
// ['thing down', 'let me work it', 'is it worth it?']
```

Since they are all the same type, we can `concat` via `compose` and the types always line up.

### Monad as a monoid

You may have noticed that `join` is an operation which takes two (nested) monads and squashes them down to one in an associative fashion. It is also a natural transformation or "functor function". As previously stated, we can make a category of functors as objects with natural transformations as morphisms. Now, if we specialize it to *Endofunctors*, that is functors of the same type, then `join` provides us with a monoid in the category of Endofunctors also known as a Monad. To show the exact formulation in code takes a little finagling which I encourage you to google, but that's the general idea.

### Applicative as a monoid

Even applicative functors have a monoidal formulation known in the category theory as a *lax monoidal functor*. We can implement the interface as a monoid and recover `ap` from it:

```js
// concat :: f a -> f b -> f [a, b]
// empty :: () -> f ()

// ap :: Functor f => f (a -> b) -> f a -> f b
const ap = compose(map(([f, x]) => f(x)), concat)
```


## In summary

So you see, everything is connected, or can be. This profound realization makes *Monoids* a powerful modelling tool for broad swaths of app architecture to the tiniest pieces of datum. I encourage you to think of *monoids* whenever direct accumulation or combination is part of your application, then once you've got that down, start to stretch the definition to more applications (you'd be surprised how much one can model with a *monoid*).

## Exercises

