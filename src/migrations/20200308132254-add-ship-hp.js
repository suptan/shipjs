'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('player_fleets', 'hp', {
      type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.INTEGER))
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('player_fleets', 'hp');
  }
};
