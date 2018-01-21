// Considering the following function:
//
//   const average = xs => reduce(add, 0, xs) / xs.length;
//
// Use the helper function `average` to refactor `averageDollarValue` as a composition.

// averageDollarValue :: [Car] -> Int
const averageDollarValue = (cars) => {
  const dollarValues = map(c => c.dollar_value, cars);
  return average(dollarValues);
};
