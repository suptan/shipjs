import models from 'models';
import { logInfo } from "utils";
import { PlayerNotJoinException, InvalidAttackAreaException } from 'exceptions';

const create = async ({
  defenderId,
  attackerId,
  seizedCoordinateX,
  seizedCoordinateY,
}, modelOptions = {}) => {
  logInfo('Create attacker damage');

  if (!attackerId || !defenderId) throw new PlayerNotJoinException();
  if ((seizedCoordinateX && seizedCoordinateX < 0)
    || (seizedCoordinateY && seizedCoordinateY < 0))
    throw new InvalidAttackAreaException();

  return await models.playerMaps.create({
    defenderId,
    attackerId,
    seizedCoordinateX,
    seizedCoordinateY,
  }, modelOptions);
};

// TODO, search on both attacker and defender
const findAllByGamePlayerId = async gameplayPlayerId => await models.playerMaps.findAll({
  where: {
    defenderId: gameplayPlayerId
  }
});

const findAttackAttempts = async ({ attackerId}) => await models.playerMaps.count({
  where: {
    attackerId,
  },
});

export default {
  create,
  findAllByGamePlayerId,
  findAttackAttempts,
};
