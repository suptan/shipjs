import model from 'models';
import { LevelNotFoundException } from 'exceptions';
import { logInfo } from 'utils';
import GAME_STATUS from 'constants/gameplay-status';

const create = async ({ levelId }, modelOptions = {}) => {
  logInfo('Checking level info');
  if (!levelId) throw new LevelNotFoundException();

  logInfo('Create game');
  return await model.gameplay.create({ levelId, status: GAME_STATUS.PLAN }, modelOptions);
};

export default {
  create,
};
