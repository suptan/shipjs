import model from 'models';
import { LevelNotFoundException } from 'exceptions';
import { logInfo } from 'utils';

const create = async ({ levelId }, modelOptions = {}) => {
  logInfo('Checking level info');
  if (!levelId) throw new LevelNotFoundException();

  logInfo('Create game');
  return await model.gameplay.create({ levelId, status: 1 }, modelOptions);
};

export default {
  create,
};
