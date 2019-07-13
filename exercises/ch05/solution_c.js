const fastestCar = compose(
  flip(concat, ' is the fastest'),
  prop('name'),
  last,
  sortBy(prop('horsepower')),
);
