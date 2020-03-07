'use strict';
module.exports = (sequelize, DataTypes) => {
  const gameplays = sequelize.define('gameplays', {
    status: DataTypes.INTEGER
  }, {});
  gameplays.associate = function(models) {
    // associations can be defined here
  };
  return gameplays;
};