import model from 'models';
import { map } from 'lodash/fp';
import { LevelNotFoundException } from 'exceptions';
import { logInfo } from 'utils';

const bulkCreate = async ({ gameplayId, playerIds }, modelOptions = {}) => {
  logInfo('Checking game info');
  // If game already start no more player should be join

  logInfo('Players join the game');
  // const gameplayPlayer = map(id => ({

  // }))
  // return await model.gameplay.create({ levelId, status: 1 }, modelOptions);
  return;
};

export default {
  bulkCreate,
};
