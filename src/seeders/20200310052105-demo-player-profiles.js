'use strict';

module.exports = {
  up: async (queryInterface) => {
    const rawQuery = await queryInterface.sequelize.query('select id from players');
    const players = rawQuery[0];
    console.log(rawQuery, players);

    if (players.length < 2) {
      await queryInterface.bulkInsert('players', [{
        name: 'defender',
        created_at: new Date(),
        updated_at: new Date(),
      },{
        name: 'attacker',
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('players', null, {});
  }
};
