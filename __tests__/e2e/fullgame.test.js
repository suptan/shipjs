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
      playerModel.bulkCreate([readyPlayer1, readyPlayer2])
    ]);
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

  it('should have game level before start', async () => {
    const {
      default: {
        map: mapModel, ship: shipModel, fleet: fleetModel, level: levelModel,
        levelFleet: levelFleetModel,
      }
    } = models;
    const battle = { name: 'Battleship', size: 4, status: 1 };
    const cruise = { name: 'Cruiser', size: 3, status: 1 };
    const destroy = { name: 'Destroyer', size: 2, status: 1 };
    const sub = { name: 'Submarine', size: 1, status: 1 };

    const [maps, ships] = await Promise.all([
      mapModel.findAll(),
      shipModel.bulkCreate([battle, cruise, destroy, sub])
    ]);
    expect(ships).toEqual(
      expect.arrayContaining([
        expect.objectContaining(battle),
        expect.objectContaining(cruise),
        expect.objectContaining(destroy),
        expect.objectContaining(sub),
      ])
    );

    const battleFleet = { shipId: ships[0].id, amount: 1, status: 1 };
    const cruiseFleet = { shipId: ships[1].id, amount: 2, status: 1 };
    const destroyFleet = { shipId: ships[2].id, amount: 3, status: 1 };
    const subFleet = { shipId: ships[3].id, amount: 4, status: 1 };
    const fleets = await fleetModel.bulkCreate([battleFleet, cruiseFleet, destroyFleet, subFleet]);
    expect(fleets).toEqual(
      expect.arrayContaining([
        expect.objectContaining(battleFleet),
        expect.objectContaining(cruiseFleet),
        expect.objectContaining(destroyFleet),
        expect.objectContaining(subFleet),
      ])
    );

    const mapFirst = maps[0];
    const demoLevel = { mapId: mapFirst.id, status: 1 };
    const level = await levelModel.create(demoLevel);
    expect(level).toEqual(expect.objectContaining(demoLevel));

    const demoLevelFleets = fleets.map(fleet => ({ levelId: level.id, fleetId: fleet.id, status: 1 }));
    const levelFleet = await levelFleetModel.bulkCreate(demoLevelFleets);
    expect(levelFleet).toEqual(
      expect.arrayContaining(demoLevelFleets.map(a => expect.objectContaining(a)))
    );
  });

  it('should be able to create a new game', async () => {
    const {
      default: {
        level: levelModel, player: playerModel
      }
    } = models;
    const [levels, players] = await Promise.all([
      levelModel.findAll(),
      playerModel.findAll()
    ]);
    const res = await request(app)
      .post('/api/latest/gameplay')
      .send({
        levelId: levels[0].id,
        players: players.map(player => ({ id: player.id})),
      });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          id: 1,
          players: {
            attackerId: 1,
            defenderId: 2
          },
        },
        statusCode: expect.any(String)
      })
    );
  });
});
