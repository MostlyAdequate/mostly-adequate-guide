require('../../../part2_exercises/support');
const {map, compose, prop, chain, sortBy, identity, split, join} = require('ramda');
const Task = require('data.task');

// Exercise 1
// ==========
// Write a natural transformation that converts `Either b a` to `Maybe a`

//  ex1 :: Either b a -> Maybe a
var ex1 = either(() => Maybe.of(null), Maybe.of)

// Exercise 2
// ==========
// Use the eitherToTask natural transformation change ex2's type signature
// from :: Number -> Task Error (Either Error String)
// to :: Number -> Task Error String

// findUser :: Number -> Task Error (Either Error User)
const findUser = x => x > 0 ? Task.of(Either.of({id: x, name: 'userface'})) : Task.of(new Left('not found'))

// eitherToTask :: Either a b -> Task a b
const eitherToTask = either(Task.rejected, Task.of)

// ex2 :: Number -> Task Error (Either Error User)
const ex2 = compose(map(prop('name')), chain(eitherToTask), findUser)



// Exercise 3
// ==========
// Using split and join, write the isomorphism between String and [Char].

// to :: String -> [Char]
const to = split('')
// from :: [Char] -> String
const from = join('')


// ex3 :: String -> String
const ex3 = compose(from, sortBy(identity), to)


module.exports = {ex1, ex2, ex3}
