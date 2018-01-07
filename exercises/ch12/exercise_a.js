// Considering the following elements:
//
//   // httpGet :: Route -> Task Error JSON
//   // routes :: Map Route Route
//   const routes = Map.of({ '/': '/', '/about': '/about' });
//
// Use the traversable interface to change the type signature of `getJsons`.
//
//   getJsons :: Map Route Route -> Task Error (Map Route JSON)

// getRoutes :: Map Route Route -> Map Route (Task Error JSON)
const getJsons = map(httpGet);
