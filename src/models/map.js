import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const model = {
    name: { type: DataTypes.STRING, allowNull: false},
    grid_vertical: { type: DataTypes.INTEGER, allowNull: false },
    grid_horizontal: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false }
  };

  const Map = sequelize.define('maps', transformModel(model), {
    paranoid: true,
  });

  Map.associate = function() {
    // associations can be defined here
  };

  return Map;
};
