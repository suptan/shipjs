'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('level_fleets', {
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
      fleet_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'fleets',
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
          fields: ['level_id', 'fleet_id'],
        }
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('level_fleets');
  }
};
