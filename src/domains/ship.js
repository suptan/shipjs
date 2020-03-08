import models from 'models';

const findOneById = async id => await models.ship.findByPk(id);

export default {
  findOneById,
};
