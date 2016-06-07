const
  SUPPORT_PATH                        = '../support',
  {IO,Maybe,Left,Right,chain}         = require(SUPPORT_PATH),
  path                                = require('path'),
  Task                                = require('data.task'),
  {compose,curry,last,map,prop,split} = require('ramda');

//-- Exercise 1 -------------------------------------------------------
// Use `safeProp` and `map/join` or `chain` to safely get the street name when given a user
const
  safeProp = curry((x, o) => Maybe.of(o[x])),
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

const
  ex1 =
    compose(chain(safeProp('name'))
           ,chain(safeProp('street'))
           ,safeProp('address')
           );


//-- Exercise 2 -------------------------------------------------------
// Use `getFile` to get the filename, remove the directory so it's just the file, then purely log it.
const
  getFile = () => new IO(() => __filename),
  pureLog = x  =>
    new IO(() => {
      console.log(x);
      return `logged ${x}`; // for testing w/o mocks
    });

const
  ex2 =
    compose(chain(compose(pureLog
                         ,last
                         ,split(path.sep)))
            ,getFile
            );


//-- Exercise 3 -------------------------------------------------------
// Use `getPost` then pass the post's id to `getComments`.
const
  {getPost,getComments} = require(SUPPORT_PATH);

const ex3 = compose(chain(compose(getComments, prop('id'))), getPost);


//-- Exercise 4 -------------------------------------------------------
// Use `validateEmail` and `addToMailingList` to implement ex4's type signature. It should
const
  //  addToMailingList :: Email -> IO([Email])
  addToMailingList = (list => email =>
    new IO(() => {
      list.push(email);
      return list;
    })
  )([]),
  emailBlast = list => new IO(() => `emailed: ${list.join(',')}`),
  validateEmail = x =>
    x.match(/\S+@\S+\.\S+/)
      ? (Right.of(x))
      : (Left.of('invalid email'));

const
  ex4 = // :: Email -> Either String (IO String)
    compose(map(compose(chain(emailBlast),addToMailingList))
           ,validateEmail
           );


module.exports = {ex1,ex2,ex3,ex4,user}
