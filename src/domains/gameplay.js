import models from 'models';
import { LevelNotFoundException } from 'exceptions';
import { logInfo } from 'utils';
import GAME_STATUS from 'constants/gameplay-status';

const create = async ({ levelId }, modelOptions = {}) => {
  logInfo('Checking level info');
  if (!levelId) throw new LevelNotFoundException();

  logInfo('Create game');
  return await models.gameplay.create({ levelId, status: GAME_STATUS.PLAN }, modelOptions);
};

const findWithFleetsStatusById = async (id, include) => await models.gameplay.findByPk(id, {
  include
});

export default {
  create,
  findWithFleetsStatusById,
};
