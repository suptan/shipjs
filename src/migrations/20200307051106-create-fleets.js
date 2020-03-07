'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fleets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ship_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ships',
          key: 'id',
        },
      },
      amount: {
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
        type: Sequelize.DATE
      },
      deleted_at: { type: Sequelize.DATE },
    }, {
      uniqueKeys: {
        actions_unique:{
          fields: ['ship_id', 'amount'],
        }
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fleets');
  }
};
