import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const players = sequelize.define('players', transformModel({
    status: { type: DataTypes.INTEGER }
  }), { paranoid: true });
  players.associate = function() {
    // associations can be defined here
  };
  return players;
};
