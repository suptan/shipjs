import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const playerMaps = sequelize.define('player_maps', transformModel({
    status: DataTypes.INTEGER
  }), { paranoid: true });
  playerMaps.associate = function(models) {
    playerMaps.belongsTo(models.player);
    playerMaps.belongsTo(models.gameplayPlayer);
  };
  return playerMaps;
};
