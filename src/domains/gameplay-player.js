import models from 'models';
import { identity, map, pickBy } from 'lodash/fp';
import { InvalidGameException, StatusRequiredException } from 'exceptions';
import { logInfo, logDebug } from 'utils';
import PLAYER_STATUS from 'constants/player-status';
import GAME_STATUS from 'constants/gameplay-status';

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

const findOneWithMapAndFleetById = async id => await models.gameplayPlayer.findByPk(id, {
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
    {
      model: models.playerFleet,
      as: 'playerFleet',
      include: [
        {
          model: models.ship,
        },
      ],
    },
  ],
});

const findOneById = async id => await models.gameplayPlayer.findByPk(id);

const createOrUpdate = async ({ id, gameplayId, playerId, status, playerMap }, modelOptions = {} ) => {
  let result;
  const criteria = {
    id,
    gameplayId,
    playerId
  };
  const gameplayPlayerModel = await models.gameplayPlayer.findOne({
    // Sequelize consider empty field as search for null
    where: pickBy(identity, criteria),
  });

  if (!gameplayPlayerModel) {
    result = await models.gameplayPlayer.create({
      gameplayId,
      playerId,
      status: status || GAME_STATUS.PLAN,
      playerMap,
    }, modelOptions);
  } else {
    if(!status && status != 0) {
      throw new StatusRequiredException();
    }

    result = await gameplayPlayerModel.update({
      status,
      playerMap,
    }, modelOptions);
  }

  return result;
};

export default {
  bulkCreate,
  findOneWithMapById,
  findOneWithMapAndFleetById,
  findOneById,
  createOrUpdate,
};
