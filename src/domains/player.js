import models from 'models';

const findAllById = async ids => await models.player.findAll({
  where: {
    id: ids
  }
});

export default {
  findAllById
};
