const request = require('supertest');
const { app } = require('../../src');
const models = require('models');

describe('full game', () => {
  beforeAll(async done => {
    models.default.sequelize.sync({ force: true, logging: false }).then(() => {
      models.default.sequelize.close();
    });
    app.listen(done);
  });
  afterAll((done) => {
    app.close(done);
  });

  it('should success fully start the API', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.body.databaseConnection).toEqual('UP');
  });

  //   describe('2 players, attacker & defender', () => {
  //     beforeEach(async () => {
  //       // Seed data
  //     //   await models.map.bulkInsert('maps', [{
  //     //     name: 'demo',
  //     //     grid_horizontal: 10,
  //     //     grid_vertical: 10,
  //     //     status: 1,
  //     //     created_at: new Date(),
  //     //     updated_at: new Date()
  //     //   }]);

  //       console.log(models.player);
      
  //       await models.player.bulkInsert([{
  //         name: 'atk',
  //         status: 1,
  //         created_at: new Date(),
  //         updated_at: new Date()
  //       }, {
  //         name: 'def',
  //         status: 1,
  //         created_at: new Date(),
  //         updated_at: new Date()
  //       }]);
  //     });
  //     it('should return how many times attackers use to sank all ships', async () => {
  //       const players = await models.player.findAll();

  //       console.log(players);
      
//       expect(players).toBe(2);
//     });
//   });
});
