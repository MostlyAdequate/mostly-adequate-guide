const findNameById = compose(map(prop('name')), chain(eitherToTask), findUserById);
