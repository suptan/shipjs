import models from 'models';
import { map } from 'lodash/fp';
import { InvalidGameException } from 'exceptions';
import { logInfo, logDebug } from 'utils';
import PLAYER_STATUS from 'src/constants/player-status';

const bulkCreate = async ({ gameplayId, playerIds }, modelOptions = {}) => {
  logInfo('Checking game info');

  if (!gameplayId || !Number.isInteger(gameplayId))
    throw new InvalidGameException();
  // If game already start no more player should be join

  logInfo('Players join the game');
  const gameplayPlayers = map(id => ({
    gameplayId,
    playerId: id,
    status: PLAYER_STATUS.WAIT,
  }), playerIds);
  logDebug(gameplayPlayers, gameplayId);
  // return await model.gameplay.create({ levelId, status: 1 }, modelOptions);
  return await models.gameplayPlayer.bulkCreate(gameplayPlayers, modelOptions);
};

const findOneWithMapById = async id => await models.gameplayPlayer.findByPk(id, {
  include: [
    {
      model: models.gameplay,
      include: [
        {
          model: models.level,
          include: [
            {
              model: models.map,
            },
          ],
        },
      ],
    },
  ],
});

export default {
  bulkCreate,
  findOneWithMapById,
};
