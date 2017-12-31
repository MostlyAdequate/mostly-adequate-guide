const getStreetName = compose(
  chain(safeProp('name')),
  chain(safeProp('street')),
  safeProp('address'),
);
