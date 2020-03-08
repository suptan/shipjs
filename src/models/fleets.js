import { transformModel } from 'utils';

// TOFIX, merge level_fleets with fleets
export default (sequelize, DataTypes) => {
  const fleets = sequelize.define('fleets', transformModel({
    amount: { type: DataTypes.INTEGER},
    status: { type: DataTypes.INTEGER}
  }), { paranoid: true });

  fleets.associate = function() {
    // associations can be defined here
  };
  return fleets;
};
