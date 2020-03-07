const VALIDATE = {
  LEVEL_NOT_FOUND: {
    statusCode: '404',
    message: 'this level not exists for play'
  },
  LOBBY_EMPTY: {
    statusCode: '400',
    message: 'minimum of 2 players before start the game'
  },
  PLAYER_NOT_JOIN: {
    statusCode: '400',
    message: 'player unable to join this game'
  },
  INVALID_GAME: {
    statusCode: '422',
    message: 'This game session is not valid to join'
  }
};

export const ERRORS = { VALIDATE };
