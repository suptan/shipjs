import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const gameplays = sequelize.define('gameplays', transformModel({
    levelId: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER },
    winnerId: { type: DataTypes.INTEGER },
    playtime: { type: DataTypes.DATE },
  }), { paranpod: true });

  gameplays.associate = function(models) {
    gameplays.belongsTo(models.level);
    // gameplays.hasMany(models.)
  };
  return gameplays;
};
