const startGame = IO.of(game)
  .ap(getFromCache('player1'))
  .ap(getFromCache('player2'));
