import model from 'models';
import { map } from 'lodash/fp';
import { InvalidGameException } from 'exceptions';
import { logInfo } from 'utils';
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
  // return await model.gameplay.create({ levelId, status: 1 }, modelOptions);
  return await model.gameplayPlayer.bulkCreate(gameplayPlayers, modelOptions);
};

export default {
  bulkCreate,
};
