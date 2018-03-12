// Using `eitherToTask`, simplify `findNameById` to remove the nested `Either`.
//
//   // eitherToTask :: Either a b -> Task a b
//   const eitherToTask = either(Task.rejected, Task.of);

// findNameById :: Number -> Task Error (Either Error User)
const findNameById = compose(map(map(prop('name'))), findUserById);
