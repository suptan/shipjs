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
    await queryInterface.bulkInsert('ships', [{
      name: 'Battleship',
      size: 4,
      status: 1,
    }, {
      name: 'Cruiser',
      size: 3,
      status: 1,
    }, {
      name: 'Destroyer',
      size: 2,
      status: 1,
    }, {
      name: 'Submarine',
      size: 1,
      status: 1,
    }]);

    const ships = await queryInterface.sequelize.query(
      `SELECT id FROM ships ORDER BY created_at DESC LIMIT 4;`
    );
    const shipRow = ships[0];

    await queryInterface.bulkInsert('fleets', [{
      shipId: shipRow[0].id,
      amount: 1,
      status: 1,
    }, {
      shipId: shipRow[1].id,
      amount: 2,
      status: 1,
    }, {
      shipId: shipRow[2].id,
      amount: 2,
      status: 1,
    }, {
      shipId: shipRow[3].id,
      amount: 2,
      status: 1,
    }]);

    const maps = await queryInterface.sequelize.query(
      `SELECT id FROM maps ORDER BY created_at DESC LIMIT 1;`
    );
    const mapRow = maps[0];

    await queryInterface.bulkInsert('levels', [{
      mapId: mapRow[0].id,
      status: 1,
    }]);

    const fleets = await queryInterface.sequelize.query(
      `SELECT id FROM fleets ORDER BY created_at DESC LIMIT 4;`
    );
    const levels = await queryInterface.sequelize.query(
      `SELECT id FROM levels ORDER BY created_at DESC LIMIT 1;`
    );
    const fleetRow = fleets[0];
    const levelId = levels[0][0].id;

    return await queryInterface.bulkInsert('level_fleets', [{
      levelId: levelId,
      fleetId: fleetRow[0].id,
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      levelId: levelId,
      fleetId: fleetRow[1].id,
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      levelId: levelId,
      fleetId: fleetRow[2].id,
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      levelId: levelId,
      fleetId: fleetRow[3].id,
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
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
