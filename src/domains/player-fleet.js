import models from 'models';
import { logInfo } from 'utils';
import PLAYER_FLEET_STATUS from 'constants/player-fleet-status';

const findAllByGameplayPlayerId = async id => await models.playerFleet.findAll({
  where: {
    gameplayPlayerId: id
  }
});

const create = async ({ gameplayPlayerId, shipId, headCoordinateX, headCoordinateY,
  tailCoordinateX, tailCoordinateY },
  modelOptions = {}) => {
  logInfo('Create player fleet in game');

  return await models.playerFleet.create({
    gameplayPlayerId,
    shipId,
    headCoordinateX,
    headCoordinateY,
    tailCoordinateX,
    tailCoordinateY,
    status: PLAYER_FLEET_STATUS.LIVE,
  }, modelOptions);
};

const updatedSink = async (
  playerFleetModel,
  modelOptions = {},
) => await playerFleetModel.update({ status: PLAYER_FLEET_STATUS.SANK }, modelOptions);

export default {
  findAllByGameplayPlayerId,
  create,
  updatedSink,
};
