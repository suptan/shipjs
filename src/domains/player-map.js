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
  if (!seizedCoordinateX, !seizedCoordinateY) throw new InvalidAttackAreaException();

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

export default {
  create,
  findAllByGamePlayerId
};
