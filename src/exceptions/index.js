import { ERRORS } from 'constants/error-format';

class BaseException extends Error {
  constructor(exception, customMessage) {
    const { message, statusCode } = exception;
    super(message);
    this.message = customMessage || message;
    this.statusCode = statusCode;
  }
}

const LevelNotFoundException = () => new BaseException(ERRORS.VALIDATE.LEVEL_NOT_FOUND);
const LobbyEmptyException = () => new BaseException(ERRORS.VALIDATE.LOBBY_EMPTY);
const PlayerNotJoinException = () => new BaseException(ERRORS.VALIDATE.PLAYER_NOT_JOIN);
const InvalidGameException = () => new BaseException(ERRORS.VALIDATE.INVALID_GAME);

export {
  BaseException,
  InvalidGameException,
  LevelNotFoundException,
  LobbyEmptyException,
  PlayerNotJoinException,
};
