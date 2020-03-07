'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gameplay_players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameplay_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'gameplays',
          key: 'id',
        },
      },
      player_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'players',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: { type: Sequelize.DATE },
    }, {
      uniqueKeys: {
        actions_unique: {
          fields: ['gameplay_id', 'player_id'],
        }
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('gameplay_players');
  }
};
