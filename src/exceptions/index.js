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
const MapNotFoundException = () => new BaseException(ERRORS.QUERY.MAP.NOT_FOUND);
const ShipNotFoundException = () => new BaseException(ERRORS.QUERY.SHIP.NOT_FOUND);
const InvalidMapCoordinationException = () => new BaseException(ERRORS.VALIDATE.INVALID_MAP_COORDINATE);
const InvalidShipPlacementException = () => new BaseException(ERRORS.VALIDATE.INVALID_SHIP_PLACEMENT);
const GameSessionNotFoundException = () => new BaseException(ERRORS.QUERY.GAMEPLAY.NOT_FOUND);
const PlayerNotInSessionException = () => new BaseException(ERRORS.VALIDATE.PLAYER_NOT_IN_SESSION);
const InvalidAttackAreaException = () => new BaseException(ERRORS.VALIDATE.INVALID_ATTACK_AREA);
const StatusRequiredException = () => new BaseException(ERRORS.UPDATE.STATUS_REQUIRED);
const GameSessionEndException = () => new BaseException(ERRORS.VALIDATE.GAME_END);

export {
  BaseException,
  InvalidGameException,
  InvalidMapCoordinationException,
  InvalidShipPlacementException,
  LevelNotFoundException,
  LobbyEmptyException,
  MapNotFoundException,
  PlayerNotJoinException,
  ShipNotFoundException,
  GameSessionNotFoundException,
  PlayerNotInSessionException,
  InvalidAttackAreaException,
  StatusRequiredException,
  GameSessionEndException,
};
