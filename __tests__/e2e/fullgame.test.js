import models from 'models';

describe('full game', () => {
  beforeAll(async () => {
    models.sequelize.sync({force: true, logging: false}).then(() => {
      models.sequelize.close();
    });
  });

  describe('2 players, attacker & defender', () => {
    beforeEach(async () => {
      // Seed data
    //   await models.map.bulkInsert('maps', [{
    //     name: 'demo',
    //     grid_horizontal: 10,
    //     grid_vertical: 10,
    //     status: 1,
    //     created_at: new Date(),
    //     updated_at: new Date()
    //   }]);

      console.log(models.player);
      
      await models.player.bulkInsert([{
        name: 'atk',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'def',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }]);
    });
    it('should return how many times attackers use to sank all ships', async () => {
      const players = await models.player.findAll();

      console.log(players);
      
      expect(players).toBe(2);
    });
  });
});
