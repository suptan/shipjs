import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const model = {
    name: { type: DataTypes.STRING, allowNull: false},
    gridVertical: { type: DataTypes.INTEGER, allowNull: false },
    gridHorizontal: { type: DataTypes.INTEGER, allowNull: false },
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
