import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const levels = sequelize.define('levels', transformModel({
    mapId: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER }
  }), { paranoid: true });

  levels.associate = function(models) {
    levels.belongsTo(models.map);
    levels.hasMany(models.gameplay, { as: 'gameplays' });
  };
  return levels;
};
