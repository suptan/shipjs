import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const ships = sequelize.define('ships', transformModel({
    name: { type: DataTypes.STRING },
    size: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER }
  }), { paranoid: true });
  ships.associate = function(models) {
    ships.hasMany(models.playerFleet, { as: 'playerFleet' });
    ships.hasMany(models.fleet, { as: 'fleet' });
  };
  return ships;
};
