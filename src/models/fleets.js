'use strict';
module.exports = (sequelize, DataTypes) => {
  const fleets = sequelize.define('fleets', {
    amount: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  fleets.associate = function(models) {
    // associations can be defined here
  };
  return fleets;
};