import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const ships = sequelize.define('ships', transformModel({
    name: { type: DataTypes.STRING },
    size: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER }
  }), { paranoid: true });
  ships.associate = function() {
    // associations can be defined here
  };
  return ships;
};
