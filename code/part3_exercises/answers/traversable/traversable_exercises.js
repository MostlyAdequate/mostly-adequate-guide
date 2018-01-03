require('../../../part2_exercises/support');
const {curry, flip, head, always, map, compose, chain, sequence, traverse} = require('ramda');
const Task = require('data.task');
const {Map} = require('immutable-ext');
const fs = require('fs');
const futurize = require('futurize').futurize(Task);
const [readFile, readdir] = [futurize(fs.readFile), futurize(fs.readdir)];
const readfile = curry(flip(readFile))

// Exercise 1
// ==========
// Use the traversable interface to change the type signature of ex1
//  from :: Map Route Route -> Map Route (Task Error JSON)
//  to :: Map Route Route -> Task Error (Map Route JSON)

const httpGet = route => Task.of(`json for ${route}`)

//  ex1 :: Map Route Route -> Map Route (Task Error JSON)
const ex1 = traverse(Task.of, httpGet, Map({'/': '/', '/about': '/about'}))


// Exercise 2
// ==========
// Using traversable, update ex2 (and its signature) to only start the game if all players are valid

// validate :: Player -> Either String Player
const validate = player => player.name ? new Right(player) : new Left('must have name')

// ex2 :: [Player] -> [Either Error Player]
const ex2 = compose(map(always('game started!')), traverse(Either.of, validate))



// Exercise 3
// ==========
// Use traversable to rearrange and flatten the nested Tasks

// first :: [a] -> Maybe a
const first = compose(Maybe.of, head)

// ex3 :: String -> String
const ex3 = compose(chain(traverse(Task.of, readfile('utf-8'))), map(first), readdir)


module.exports = {ex1, ex2, ex3}
