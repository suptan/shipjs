import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const gameplayPlayers = sequelize.define('gameplay_players', transformModel({
    gameplayId: { type: DataTypes.INTEGER },
    playerId: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER },
  }), { paranoid: true });

  gameplayPlayers.associate = function(models) {
    gameplayPlayers.belongsTo(models.gameplay);
    gameplayPlayers.belongsTo(models.player);
    gameplayPlayers.hasMany(models.playerFleet, { foreignKey: 'gameplay_player_id', as: 'playerFleet'});
  };

  return gameplayPlayers;
};
