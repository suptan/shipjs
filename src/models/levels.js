'use strict';
module.exports = (sequelize, DataTypes) => {
  const levels = sequelize.define('levels', {
    staus: DataTypes.INTEGER
  }, {});
  levels.associate = function(models) {
    // associations can be defined here
  };
  return levels;
};