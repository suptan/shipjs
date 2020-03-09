'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('gameplays', 'gameplays_winner_id_fkey');
    return queryInterface.changeColumn('gameplays', 'winner_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'gameplay_players',
        key: 'id',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('gameplays', 'gameplays_winner_id_fkey');
    return queryInterface.changeColumn('gameplays', 'winner_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'players',
        key: 'id',
      },
    });
  }
};
