'use strict';
module.exports = (sequelize, DataTypes) => {
  const ships = sequelize.define('ships', {
    name: DataTypes.STRING,
    size: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {});
  ships.associate = function(models) {
    // associations can be defined here
  };
  return ships;
};