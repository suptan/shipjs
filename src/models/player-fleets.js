import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const playerFleets = sequelize.define('player_fleets', transformModel({
    gameplayPlayerId: { type: DataTypes.INTEGER },
    shipId: { type: DataTypes.INTEGER },
    headCoordinateX: { type: DataTypes.INTEGER },
    headCoordinateY: { type: DataTypes.INTEGER },
    tailCoordinateX: { type: DataTypes.INTEGER },
    tailCoordinateY: { type: DataTypes.INTEGER },
    hp: { type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.INTEGER)) },
    status: { type: DataTypes.INTEGER }
  }), { paranoid: true });
  playerFleets.associate = function(models) {
    playerFleets.belongsTo(models.gameplayPlayer);
    playerFleets.belongsTo(models.ship);
  };
  return playerFleets;
};
