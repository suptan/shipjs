import models from 'models';

const findAllByIds = async ids => await models.player.findAll({
  where: {
    id: ids
  }
});

export default {
  findAllByIds
};
