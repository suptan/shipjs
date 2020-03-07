import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const levels = sequelize.define('levels', transformModel({
    status: { type: DataTypes.INTEGER }
  }), { paranoid: true });

  levels.associate = function(models) {
    levels.hasMany(models.gameplay, { as: 'gameplays' });
  };
  return levels;
};
