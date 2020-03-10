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
    const cruisers = await models.default.playerFleet.findAll({
      where: {
        shipId: 2,
        gameplayPlayerId: 2,
      },
    });
    expect(cruisers.length).toEqual(2);
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
      headCoordinateX: 9,
      headCoordinateY: 4,
      tailCoordinateX: 9,
      tailCoordinateY: 4,
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

  describe('attacking', () => {
    describe('invalid coordination', () => {});
    describe('valid coordination', () => {
      it('should be able to attack first half of the map', async () => {
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 5; j++) {
            const res = await request(app)
              .post('/api/latest/player-map')
              .send({
                attackerId: 1,
                defenderId: 2,
                seizedCoordinateX: i,
                seizedCoordinateY: j,
              });
            expect(res.statusCode).toEqual(200);
            let message = 'Miss';
            // Hit 1st cruiser
            if (i === 0 && ([0, 1, 2].indexOf(j) > -1)) {
              message = j === 2 ? 'You just sank a Cruiser' : 'Hit';
            }
            // Hit 2nd cruiser
            else if (j === 0 && ([7, 8, 9].indexOf(i) > -1)) {
              message = i === 9 ? 'You just sank a Cruiser' : 'Hit';
            }
            // Hit 1st submarine
            else if (j === 1 && i === 4) {
              console.log('sank 1st submarine');
              message = 'You just sank a Submarine';
            }
            // Hit 2nd submarine
            else if (j === 4 && i === 9) {
              console.log('sank 2nd submarine');
              message = 'You just sank a Submarine';
            }
            // Hit 1st destroyer
            else if (j === 4 && ([1, 2].indexOf(i) > -1)) {
              message = i === 2 ? 'You just sank a Destroyer' : 'Hit';
            }
            // Hit battleship
            else if (j === 4 && ([4, 5, 6, 7].indexOf(i) > -1)) {
              message = i === 7 ? 'You just sank a Battleship' : 'Hit';
            }
            expect(res.body).toEqual(
              expect.objectContaining({
                statusCode: '200',
                data: expect.objectContaining({ message })
              })
            );
          }
        }
      });
      it.skip('should not be able to attack same cell twice', async () => {
        const res = await request(app)
          .post('/api/latest/player-map')
          .send({
            attackerId: 1,
            defenderId: 2,
            seizedCoordinateX: 3,
            seizedCoordinateY: 3,
          });
        const testing = await models.default.playerMaps.findAll({ where: { seizedCoordinateX: 3, seizedCoordinateY: 3 }});
        console.log(testing.length);
        expect(res.statusCode).toEqual(500);
      });
      it('should be able to retrieve game state which 6 ships sunk', async () => {
        const res = await request(app).get('/api/latest/gameplay/1?include=gameplayPlayer.playerFleet');
        const {
          body: {
            data: {
              winnerId, gameplayPlayer,
            },
          },
        } = res;
        const attacker = gameplayPlayer.find(({ id }) => id === 1);
        const defender = gameplayPlayer.find(({ id }) => id === 2);
        const battleship = defender.playerFleet.filter(({ shipId }) => shipId === 1);
        const cruisers = defender.playerFleet.filter(({ shipId }) => shipId === 2);
        const destroyers = defender.playerFleet.filter(({ shipId }) => shipId === 3);
        const submarines = defender.playerFleet.filter(({ shipId }) => shipId === 4);
        expect(winnerId).toBeNull();
        expect(gameplayPlayer).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ playerId: 1 }),
            expect.objectContaining({ playerId: 2 }),
          ])
        );
        expect(attacker.playerMap).toBeNull();
        expect(attacker.playerFleet).toEqual([]);
        // console.log(defender.playerFleet);

        expect(battleship.length).toEqual(1);
        expect(battleship[0]).toEqual(
          expect.objectContaining({ shipId: 1, hp: [], status: 2 })
        );
        expect(cruisers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ shipId: 2, hp: [], status: 2 }),
            expect.objectContaining({ shipId: 2, hp: [], status: 2 })
          ])
        );
        expect(destroyers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              shipId: 3, hp: [[7, 1], [8, 1]], status: 0,
              tailCoordinateX: 1, tailCoordinateY: 7,
              headCoordinateX: 1, headCoordinateY: 8,
            }),
            expect.objectContaining({
              shipId: 3, hp: [[7, 3], [7, 4]], status: 0,
              tailCoordinateX: 4, tailCoordinateY: 7,
              headCoordinateX: 3, headCoordinateY: 7,
            }),
            expect.objectContaining({
              shipId: 3, hp: [], status: 2,
              tailCoordinateX: 1, tailCoordinateY: 4,
              headCoordinateX: 2, headCoordinateY: 4,
            })
          ])
        );
        expect(submarines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ shipId: 4, hp: [[9, 9]], status: 0 }),
            expect.objectContaining({ shipId: 4, hp: [[9, 7]], status: 0 }),
            expect.objectContaining({
              shipId: 4, hp: [], status: 2,
              tailCoordinateX: 9, tailCoordinateY: 4,
              headCoordinateX: 9, headCoordinateY: 4,
            }),
            expect.objectContaining({
              shipId: 4, hp: [], status: 2,
              tailCoordinateX: 4, tailCoordinateY: 1,
              headCoordinateX: 4, headCoordinateY: 1,
            })
          ])
        );
      });
      it('should be able to attack last half of the map', async () => {
        for (let i = 0; i < 10; i++) {
          for (let j = 5; j < 10; j++) {
            const res = await request(app)
              .post('/api/latest/player-map')
              .send({
                attackerId: 1,
                defenderId: 2,
                seizedCoordinateX: i,
                seizedCoordinateY: j,
              });
            expect(res.statusCode).toEqual(200);
            let message = 'Miss';
            // Hit 2nd destroyer
            if (i === 1 && ([7, 8].indexOf(j) > -1)) {
              message = j === 8 ? 'You just sank a Destroyer' : 'Hit';
            }
            // Hit 3rd destroyer
            else if (j === 7 && ([3, 4].indexOf(i) > -1)) {
              message = i === 4 ? 'You just sank a Destroyer' : 'Hit';
            }
            // Hit 3rd submarine
            else if (j === 9 && i === 7) {
              console.log('sank 3rd submarine');
              message = 'You just sank a Submarine';
            }
            // Hit 4th submarine, last ship, game will end
            else if (j === 9 && i === 9) {
              console.log('sank 4th (last) submarine');
              message = 'Win! You have completed the game in 100 moves';
            }
            expect(res.body).toEqual(
              expect.objectContaining({
                statusCode: '200',
                data: expect.objectContaining({ message })
              })
            );
          }
        }
      });
    });
  });
});
