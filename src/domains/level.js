import models from 'models';

const findOneById = async id => await models.level.findByPk(id);

export default {
  findOneById,
};
