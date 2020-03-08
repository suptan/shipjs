'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('player_fleets', {
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
      ship_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ships',
          key: 'id',
        },
      },
      head_coordinate_x: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      head_coordinate_y: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      tail_coordinate_x: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      tail_coordinate_y: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('player_fleets');
  }
};
