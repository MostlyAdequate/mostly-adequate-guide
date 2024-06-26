// Refactor to remove all arguments by partially applying the functions.

// filterQs :: [String] -> [String]
// const filterQs = xs => filter(x => x.match(/q/i), xs);
// const filterQs = filter(x => x.match(/q/i));
// const filterQs = filter(match(/q/i));
//   changing from using String.prototype.match to ramda's match
//   x => x.match(/q/i) is a function that accepts a string and returns a string
//   match(/q/i) is a function that accepts a string (the remaining arg after partial application) and returns a string
const filterQs = filter(match(/q/i));
