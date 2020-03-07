import { transformModel } from 'utils';

export default (sequelize, DataTypes) => {
  const gameplays = sequelize.define('gameplays', transformModel({
    status: { type: DataTypes.INTEGER }
  }), { paranpod: true });

  gameplays.associate = function() {
    // associations can be defined here
  };
  return gameplays;
};
