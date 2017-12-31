const joinMailingList = compose(
  map(compose(chain(emailBlast), addToMailingList)),
  validateEmail,
);
