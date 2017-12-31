// Refactor to remove all arguments by partially applying the functions.

const filterQs = xs => filter(x => x.match(/q/i), xs);
