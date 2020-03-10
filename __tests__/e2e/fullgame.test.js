const request = require('supertest');
const { app } = require('../../src');
const models = require('models');

describe('full game', () => {
  beforeAll(async done => {
    await models.default.sequelize.sync({ force: true, logging: false });
    app.listen(done);
    // seed data
  });
  afterAll((done) => {
    models.default.sequelize.close();

    app.close(done);
  });

  it('should success fully start the API', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.body.databaseConnection).toEqual('UP');
  });

  it('should have map and players before start', async () => {
    const {
      default: {
        map: mapModel,
        player: playerModel,
      }
    } = models;

    const demoMap = {
      name: 'oasis',
      gridHorizontal: 10,
      gridVertical: 10,
      status: 1,
    };
    const readyPlayer1 = { name: 'Wade' };
    const readyPlayer2 = { name: 'Mark' };
    const [readyMap, readyPlayers] = await Promise.all([
      mapModel.create(demoMap),
      playerModel.bulkInsert([readyPlayer1, readyPlayer2])
    ]);
    console.log('readyMap', readyMap);
    expect(readyMap).toEqual(
      expect.objectContaining(demoMap)
    );
    expect(readyPlayers).toEqual(
      expect.arrayContaining([
        expect.objectContaining(readyPlayer1),
        expect.objectContaining(readyPlayer2),
      ])
    );
  });

  // it('should have game level before start', async () => {
  //   const {
  //     default: {
  //       map: mapModel, ship: shipModel, fleet: fleetModel, level: levelModel,
  //       levelFleet: leveleFleetModel,
  //     }
  //   } = models;

    
  // });
});
