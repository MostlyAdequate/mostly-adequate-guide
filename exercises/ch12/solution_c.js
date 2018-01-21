// readFirst :: String -> Task Error (Maybe String)
const readFirst = compose(
  chain(traverse(Task.of, readfile('utf-8'))),
  map(safeHead),
  readdir,
);
