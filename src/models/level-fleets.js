import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const level_fleets = sequelize.define('level_fleets', transformModel({
    status: { type: DataTypes.INTEGER }
  }), { paranoid: true });
  level_fleets.associate = function() {
    // associations can be defined here
  };
  return level_fleets;
};
