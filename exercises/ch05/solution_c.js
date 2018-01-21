const append = flip(concat);

const fastestCar = compose(
  append(' is the fastest'),
  prop('name'),
  last,
  sortBy(prop('horsepower')),
);

