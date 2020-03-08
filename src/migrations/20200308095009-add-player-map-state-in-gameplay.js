'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('gameplay_players', 'player_map', {
      type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.INTEGER))
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('gameplay_players', 'player_map');
  }
};
