import models from 'models';

const findAllByGameplayPlayerId = async id => await models.level.findAll({
  where: {
    gameplayPlayerId: id
  }
});

export default {
  findAllByGameplayPlayerId,
};
