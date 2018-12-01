/**
 * @copyright 2018 mostly-adequate
 * @license MIT
 */

const support = require('./support'); // Contains global references


// Essential FP Helpers

exports.always = always;
exports.compose = compose;
exports.curry = curry;
exports.either = either;
exports.identity = identity;
exports.inspect = inspect;
exports.left = left;
exports.liftA2 = liftA2;
exports.liftA3 = liftA3;
exports.maybe = maybe;
exports.nothing = nothing;
exports.reject = reject;

// Algebraic Data Structures

exports.Either = Either;
exports.IO = IO;
exports.Identity = Identity;
exports.Left = Left;
exports.List = List;
exports.Map = Map;
exports.Maybe = Maybe;
exports.Right = Right;
exports.Task = Task;


// Currified version of common functions

exports.add = add;
exports.chain = chain;
exports.concat = concat;
exports.eq = eq;
exports.filter = filter;
exports.flip = flip;
exports.forEach = forEach;
exports.head = head;
exports.intercalate = intercalate;
exports.join = join;
exports.last = last;
exports.map = map;
exports.match = match;
exports.prop = prop;
exports.reduce = reduce;
exports.safeHead = safeHead;
exports.safeProp = safeProp;
exports.sequence = sequence;
exports.sortBy = sortBy;
exports.split = split;
exports.take = take;
exports.toLowerCase = toLowerCase;
exports.toUpperCase = toUpperCase;
exports.traverse = traverse;
exports.unsafePerformIO = unsafePerformIO;
