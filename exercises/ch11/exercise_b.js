// Using `eitherToTask`, simplify `findNameById` to remove the nested `Either`.
//
//   // eitherToTask :: Either a b -> Task a b
//   const eitherToTask = either(Task.rejected, Task.of);
//   // findUserById :: Number -> Task Error (Either Error User)
//   const findUserById = ...
// 
const findNameById = compose(map(map(prop('name'))), findUserById);
