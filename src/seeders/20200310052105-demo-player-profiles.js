'use strict';

module.exports = {
  up: async (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const players = await queryInterface.rawSelect('players');

    if (!players && players.length < 2) {
      await queryInterface.bulkInsert('players', [{
        name: 'defender'
      },{
        name: 'attacker'
      }]);
    }
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('ships', null, {});
  }
};
