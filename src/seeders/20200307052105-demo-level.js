'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('ships', [{
      name: 'Battleship',
      size: 4,
      status: 1,
      created_at: new Date(),
    }, {
      name: 'Cruiser',
      size: 3,
      status: 1,
      created_at: new Date(),
    }, {
      name: 'Destroyer',
      size: 2,
      status: 1,
      created_at: new Date(),
    }, {
      name: 'Submarine',
      size: 1,
      status: 1,
      created_at: new Date(),
    }]);

    const ships = await queryInterface.sequelize.query(
      `SELECT id FROM ships ORDER BY created_at DESC LIMIT 4;`
    );
    const shipRow = ships[0];

    await queryInterface.bulkInsert('fleets', [{
      ship_id: shipRow[0].id,
      amount: 1,
      status: 1,
      created_at: new Date(),
    }, {
      ship_id: shipRow[1].id,
      amount: 2,
      status: 1,
      created_at: new Date(),
    }, {
      ship_id: shipRow[2].id,
      amount: 2,
      status: 1,
      created_at: new Date(),
    }, {
      ship_id: shipRow[3].id,
      amount: 2,
      status: 1,
      created_at: new Date(),
    }]);

    const maps = await queryInterface.sequelize.query(
      `SELECT id FROM maps ORDER BY created_at DESC LIMIT 1;`
    );
    const mapRow = maps[0];

    await queryInterface.bulkInsert('levels', [{
      map_id: mapRow[0].id,
      status: 1,
      created_at: new Date(),
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
      level_id: levelId,
      fleet_id: fleetRow[0].id,
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      level_id: levelId,
      fleet_id: fleetRow[1].id,
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      level_id: levelId,
      fleet_id: fleetRow[2].id,
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      level_id: levelId,
      fleet_id: fleetRow[3].id,
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
