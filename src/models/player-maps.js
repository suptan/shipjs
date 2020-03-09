import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const playerMaps = sequelize.define('player_maps', transformModel({
    defenderId: { type: DataTypes.INTEGER },
    attackerId: { type: DataTypes.INTEGER },
    seizedCoordinateX: { type: DataTypes.INTEGER },
    seizedCoordinateY: { type: DataTypes.INTEGER },
  }), { paranoid: true });
  playerMaps.associate = function(models) {
    playerMaps.belongsTo(models.player, { foreignKey: 'attacker_id', as: 'player' });
    playerMaps.belongsTo(models.player, { foreignKey: 'defender_id', as: 'player' });
  };
  return playerMaps;
};
