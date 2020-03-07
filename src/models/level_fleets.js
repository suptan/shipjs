'use strict';
module.exports = (sequelize, DataTypes) => {
  const level_fleets = sequelize.define('level_fleets', {
    status: DataTypes.INTEGER
  }, {});
  level_fleets.associate = function(models) {
    // associations can be defined here
  };
  return level_fleets;
};