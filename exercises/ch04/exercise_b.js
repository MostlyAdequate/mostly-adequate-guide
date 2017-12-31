// Refactor to remove all arguments by partially applying the functions.

// filterQs :: [String] -> [String]
const filterQs = xs => filter(x => x.match(/q/i), xs);
