'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('player_maps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameplay_player_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'gameplay_players',
          key: 'id',
        },
      },
      seized_by_player_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'players',
          key: 'id',
        },
      },
      seized_coordinate_x: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      seized_coordinate_y: {
        allowNull: false,
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
          fields: ['gameplay_player_id', 'seized_coordinate_x', 'seized_coordinate_y'],
        }
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('player_maps');
  }
};
