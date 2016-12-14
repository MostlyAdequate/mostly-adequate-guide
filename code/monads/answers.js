var
  Support = require('../support'),
  chain   = Support.chain,
  IO      = Support.IO,
  Maybe   = Support.Maybe,
  Task    = require('data.task'),
  _       = require('ramda');

//-- Exercise 1 -------------------------------------------------------
// Use `safeProp` and `_.map/join` or `chain` to safely get the street name when given a user
var
  safeProp = _.curry(function(x, o) { return Maybe.of(o[x]); }),
  user = {
    id: 2,
    name: 'albert',
    address: {
      street: {
        number: 22,
        name: 'Walnut St'
      }
    }
  };

var
  ex1 =
    _.compose(chain(safeProp('name'))
             ,chain(safeProp('street'))
             ,safeProp('address')
             );


//-- Exercise 2 -------------------------------------------------------
// Use `getFile` to get the filename, remove the directory so it's just the file, then purely log it.
var
  path    = require('path'),
  getFile = function() { return new IO(function() { return __filename; }) },
  pureLog = function(x) {
    return new IO(function() {
      console.log(x);
      return `logged ${x}`; // for testing w/o mocks
    });
  };

var
  ex2 =
    _.compose(chain(_.compose(pureLog
                         ,_.last
                         ,_.split(path.sep)))
            ,getFile
            );


//-- Exercise 3 -------------------------------------------------------
// Use `getPost` then pass the post's id to `getComments`.
var
  getPost     = Support.getPost,
  getComments = Support.getComments;

var ex3 = _.compose(chain(_.compose(getComments, _.prop('id'))), getPost);


//-- Exercise 4 -------------------------------------------------------
// Use `validateEmail` and `addToMailingList` to implement ex4's type signature. It should
var
//addToMailingList :: Email -> IO([Email])
  addToMailingList = (function(list){
    return function(email) {
      return new IO(function(){
        list.push(email);
        return list;
      });
    }
  })([]),
//emailBlast :: [Email] -> IO String
  emailBlast = function emailBlast(list) {
    return new IO(function(){
      return 'emailed: ' + list.join(',');
    });
  },

//validateEmail :: Email -> Either String Email
  validateEmail = function(x){
    return x.match(/\S+@\S+\.\S+/)
      ? (new Right(x))
      : (new Left('invalid email'));
  };

var
  ex4 = // :: Email -> Either String (IO String)
    _.compose(_.map(_.compose(chain(emailBlast),addToMailingList))
           ,validateEmail
           );


  //-- Exports ----------------------------------------------------------
  module.exports = {ex1:ex1,ex2:ex2,ex3:ex3,ex4:ex4,user:user}
