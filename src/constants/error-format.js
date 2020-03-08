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
  },
  INVALID_MAP_COORDINATE: {
    statusCode: '422',
    message: 'These coordination not fit with the map'
  },
  INVALID_SHIP_PLACEMENT: {
    statusCode: '422',
    message: 'Ship cannot be place in this position'
  },
  PLAYER_NOT_IN_SESSION: {
    statusCode: '422',
    message: 'player not in this session'
  },
  INVALID_ATTACK_AREA: {
    statusCode: '422',
    message: 'this area cannot be attack'
  }
};

const QUERY = {
  MAP: {
    NOT_FOUND: {
      statusCode: '404',
      message: 'Map info not found'
    },
  },
  SHIP: {
    NOT_FOUND: {
      statusCode: '404',
      message: 'Ship info not found'
    }
  },
  GAMEPLAY: {
    NOT_FOUND: {
      statusCode: '404',
      message: 'Game session not found'
    }
  },
};

export const ERRORS = { VALIDATE, QUERY };
