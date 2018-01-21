// getJsons :: Map Route Route -> Task Error (Map Route JSON)
const getJsons = traverse(Task.of, httpGet);
