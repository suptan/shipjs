import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const gameplays = sequelize.define('gameplays', transformModel({
    levelId: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER },
    winnerId: { type: DataTypes.INTEGER },
    playtime: { type: DataTypes.DATE },
  }), { paranoid: true });

  gameplays.associate = function(models) {
    gameplays.belongsTo(models.level);
    gameplays.hasMany(models.gameplayPlayer, { foreignKey: 'gameplay_id', as: 'gameplayPlayer' });
  };
  return gameplays;
};
