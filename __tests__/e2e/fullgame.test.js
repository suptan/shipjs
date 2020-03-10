const request = require('supertest');
const { app } = require('../../src');
const models = require('models');
const { ERRORS } = require('constants/error-format');

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
        statusCode: '200'
      })
    );
  });

  it('should be able to place a battleship', async () => {
    const {
      default: {
        ship: shipModel,
      }
    } = models;
    const battleship = await shipModel.findOne({
      where: { name: 'Battleship' }
    });
    const defenderId = 2;
    const reqBody = {
      shipId: battleship.id,
      headCoordinateX: 4,
      headCoordinateY: 4,
      tailCoordinateX: 7,
      tailCoordinateY: 4,
    };
    const res = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...reqBody, defenderId });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...reqBody,
            gameplayPlayerId: defenderId,
          }),
        },
      })
    );
  });

  it('should be able to place cruisers', async () => {
    const {
      default: {
        ship: shipModel,
      }
    } = models;
    const cruiser = await shipModel.findOne({
      where: { name: 'Cruiser' }
    });
    const defenderId = 2;
    const shipId = cruiser.id;
    const place1st = {
      headCoordinateX: 0,
      headCoordinateY: 0,
      tailCoordinateX: 0,
      tailCoordinateY: 2,
    };
    const res1st = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place1st, shipId, defenderId });
    expect(res1st.statusCode).toEqual(200);
    expect(res1st.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...place1st,
            gameplayPlayerId: defenderId,
            shipId
          }),
        },
      })
    );

    const place2nd = {
      headCoordinateX: 3,
      headCoordinateY: 3,
      tailCoordinateX: 3,
      tailCoordinateY: 3,
    };
    const res2nd = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place2nd, shipId, defenderId });
    expect(res2nd.statusCode).toEqual(404);
    expect(res2nd.body).toEqual({
      type: 'Error',
      message: ERRORS.QUERY.SHIP.NOT_FOUND.message
    });

    const place3rd = {
      headCoordinateX: 3,
      headCoordinateY: 3,
      tailCoordinateX: 5,
      tailCoordinateY: 3,
    };
    const res3rd = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place3rd, shipId, defenderId });
    expect(res3rd.statusCode).toEqual(422);
    expect(res3rd.body).toEqual({
      type: 'Error',
      message: ERRORS.VALIDATE.INVALID_SHIP_PLACEMENT.message
    });

    const place4rd = {
      headCoordinateX: 7,
      headCoordinateY: 0,
      tailCoordinateX: 9,
      tailCoordinateY: 0,
    };
    const res4rd = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place4rd, shipId, defenderId });
    // console.log(res4rd);
    expect(res4rd.statusCode).toEqual(200);
    expect(res4rd.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...place4rd,
            gameplayPlayerId: defenderId,
            shipId
          }),
        },
      })
    );
  });

  it('should be able to place destroyers', async () => {
    const {
      default: {
        ship: shipModel,
      }
    } = models;
    const destroyer = await shipModel.findOne({
      where: { name: 'Destroyer' }
    });
    const defenderId = 2;
    const shipId = destroyer.id;
    const place1st = {
      headCoordinateX: 2,
      headCoordinateY: 4,
      tailCoordinateX: 1,
      tailCoordinateY: 4,
    };
    const res1st = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place1st, shipId, defenderId });
    expect(res1st.statusCode).toEqual(200);
    expect(res1st.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...place1st,
            gameplayPlayerId: defenderId,
            shipId
          }),
        },
      })
    );

    const place2nd = {
      headCoordinateX: 1,
      headCoordinateY: 8,
      tailCoordinateX: 1,
      tailCoordinateY: 7,
    };
    const res2nd = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place2nd, shipId, defenderId });
    expect(res2nd.statusCode).toEqual(200);
    expect(res2nd.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...place2nd,
            gameplayPlayerId: defenderId,
            shipId
          }),
        },
      })
    );

    const place3rd = {
      headCoordinateX: 3,
      headCoordinateY: 7,
      tailCoordinateX: 4,
      tailCoordinateY: 7,
    };
    const res3rd = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place3rd, shipId, defenderId });
    expect(res3rd.statusCode).toEqual(200);
    expect(res3rd.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...place3rd,
            gameplayPlayerId: defenderId,
            shipId
          }),
        },
      })
    );
  });

  it('should be able to place submarines', async () => {
    const {
      default: {
        ship: shipModel,
      }
    } = models;
    const submarine = await shipModel.findOne({
      where: { name: 'Submarine' }
    });
    const defenderId = 2;
    const shipId = submarine.id;
    const place1st = {
      headCoordinateX: 4,
      headCoordinateY: 1,
      tailCoordinateX: 4,
      tailCoordinateY: 1,
    };
    const res1st = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place1st, shipId, defenderId });
    expect(res1st.statusCode).toEqual(200);
    expect(res1st.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...place1st,
            gameplayPlayerId: defenderId,
            shipId
          }),
        },
      })
    );

    const place2nd = {
      headCoordinateX: -1,
      headCoordinateY: -1,
      tailCoordinateX: -1,
      tailCoordinateY: -1,
    };
    const res2nd = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place2nd, shipId, defenderId });
    expect(res2nd.statusCode).toEqual(500);
    expect(res2nd.body).toEqual({
      message: '"headCoordinateX" must be a positive number',
      type: 'ValidationError'
    });

    const place3rd = {
      headCoordinateX: 10,
      headCoordinateY: 10,
      tailCoordinateX: 10,
      tailCoordinateY: 10,
    };
    const res3rd = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place3rd, shipId, defenderId });
    expect(res3rd.statusCode).toEqual(422);
    expect(res3rd.body).toEqual({
      message: 'These coordination not fit with the map',
      type: 'Error'
    });

    const place4th = {
      headCoordinateX: 4,
      headCoordinateY: 9,
      tailCoordinateX: 4,
      tailCoordinateY: 9,
    };
    const res4th = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place4th, shipId, defenderId });
    expect(res4th.statusCode).toEqual(200);
    expect(res4th.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...place4th,
            gameplayPlayerId: defenderId,
            shipId
          }),
        },
      })
    );

    const place5th = {
      headCoordinateX: 9,
      headCoordinateY: 9,
      tailCoordinateX: 9,
      tailCoordinateY: 9,
    };
    const res5th = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place5th, shipId, defenderId });
    expect(res5th.statusCode).toEqual(200);
    expect(res5th.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...place5th,
            gameplayPlayerId: defenderId,
            shipId
          }),
        },
      })
    );

    const place6th = {
      headCoordinateX: 7,
      headCoordinateY: 9,
      tailCoordinateX: 7,
      tailCoordinateY: 9,
    };
    const res6th = await request(app)
      .post('/api/latest/player-fleet')
      .send({ ...place6th, shipId, defenderId });
    expect(res6th.statusCode).toEqual(200);
    expect(res6th.body).toEqual(
      expect.objectContaining({
        statusCode: '200',
        data: {
          playerFleet: expect.objectContaining({
            ...place6th,
            gameplayPlayerId: defenderId,
            shipId
          }),
        },
      })
    );
  });
});
