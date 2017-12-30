const validateName = ({ name }) => (name.length > 3
  ? Either.of(null)
  : left('Your name need to be > 3')
);

const saveAndWelcome = compose(map(showWelcome), save);

const register = compose(
  either(IO.of, saveAndWelcome),
  validateUser(validateName),
);
