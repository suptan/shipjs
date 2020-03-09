'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('player_maps', 'player_maps_attacker_id_fkey');
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('player_maps', 'player_maps_attacker_id_fkey');
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
