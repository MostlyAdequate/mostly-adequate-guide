// Considering the following elements:
//
//   // httpGet :: Route -> Task Error JSON
//   // routes :: Map Route Route
//   const routes = new Map({ '/': '/', '/about': '/about' });
//
// Use the traversable interface to change the type signature of `getJsons`.
//
//   getJsons :: Map Route Route -> Task Error (Map Route JSON)

// getJsons :: Map Route Route -> Map Route (Task Error JSON)
const getJsons = map(httpGet);
