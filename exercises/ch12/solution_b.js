// startGame :: [Player] -> Either Error String
const startGame = compose(map(always('game started!')), traverse(Either.of, validate));
