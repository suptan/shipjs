'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('player_maps', 'gameplay_player_id', 'defender_id'),
      queryInterface.changeColumn('player_maps', 'attacker_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'gameplay_players',
          key: 'id',
        },
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('player_maps', 'defender_id', 'gameplay_player_id'),
      queryInterface.changeColumn('player_maps', 'attacker_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'players',
          key: 'id',
        },
      }),
    ]);
  }
};
