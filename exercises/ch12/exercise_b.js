// Using traversable, and the `validate` function, update `startGame` (and its signature)
// to only start the game if all players are valid
//
//   // validate :: Player -> Either String Player
//   validate = player => (player.name ? Either.of(player) : left('must have name'));

// startGame :: [Player] -> [Either Error String]
const startGame = compose(map(map(always('game started!'))), map(validate));
