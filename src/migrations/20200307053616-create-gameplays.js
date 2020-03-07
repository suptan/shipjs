'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gameplays', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      level_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'levels',
          key: 'id',
        },
      },
      winner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'players',
          key: 'id',
        },
      },
      playtime: { type: Sequelize.DATE },
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
    return queryInterface.dropTable('gameplays');
  }
};
