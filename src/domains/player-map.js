import models from 'models';
import { logInfo } from "utils";
import { GameSessionNotFoundException, PlayerNotJoinException, InvalidAttackAreaException } from 'exceptions';

const create = async ({
  gameplayPlayerId,
  attackerId,
  seizedCoordinateX,
  seizedCoordinateY,
}, modelOptions = {}) => {
  logInfo('Create attacker damage');

  if (!gameplayPlayerId) throw new GameSessionNotFoundException();
  if (!attackerId) throw new PlayerNotJoinException();
  if ((seizedCoordinateX && seizedCoordinateX < 0)
    || (seizedCoordinateY && seizedCoordinateY < 0))
    throw new InvalidAttackAreaException();

  return await models.playerMaps.create({
    gameplayPlayerId,
    attackerId,
    seizedCoordinateX,
    seizedCoordinateY,
  }, modelOptions);
};

const findAllByGamePlayerId = async gameplayPlayerId => await models.playerMaps.findAll({
  where: {
    gameplayPlayerId
  }
});

const findAttackAttempts = async({ gameplayPlayerId, attackerId}) => await models.playerMaps.count({
  where: {
    gameplayPlayerId,
    attackerId,
  },
});

export default {
  create,
  findAllByGamePlayerId,
  findAttackAttempts,
};
