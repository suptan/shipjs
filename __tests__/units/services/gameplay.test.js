import { map } from 'lodash/fp';
import { gameplay } from 'services';
import domains from 'domains';
import models from 'models';
import { ERRORS } from 'dist/constants/error-format';

const mockTransaction = { transaction: 'some-transaction' };

jest.mock('models', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
}));
jest.mock('domains', () => ({
  gameplay: {
    create: jest.fn()
  },
  level:{
    findOneById: jest.fn()
  },
  player:{
    findAllByIds: jest.fn()
  },
  gameplayPlayer:{
    bulkCreate: jest.fn()
  }
}));
jest.mock('utils', () => ({
  logInfo: jest.fn(),
  logDebug: jest.fn()
}));

describe('services/gameplay', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('create request', () => {
    describe('valid', () => {
      it('should return status 200 when create game by existing level and 2 valid player', async () => {
        const players = [{ id: 1 }, { id: 2 }];
        const input = {
          levelId: 1,
          players,
        };
        const playerIds = map('id', input.players);
        const mockNewGameSession = { id: 2 };
        const mockLevel = { id: 1 };
        const mockPlayers = [{ id: 1 }, { id: 2 }];
        const mockGameWithPlayers = [{ id: 1, gameId: 2, playerId: 1 }, { id: 2, gameId: 2, playerId: 2 }];

        models.sequelize.transaction = jest.fn(async (fn) => fn(mockTransaction.transaction));
        domains.gameplay.create = jest.fn(() => mockNewGameSession);
        domains.level.findOneById = jest.fn(() => mockLevel);
        domains.player.findAllByIds = jest.fn(() => mockPlayers);
        domains.gameplayPlayer.bulkCreate = jest.fn(() => mockGameWithPlayers);

        const result = await gameplay.create(input);
        expect(domains.gameplay.create).toHaveBeenCalledWith({
          levelId: input.levelId
        }, mockTransaction);
        expect(domains.level.findOneById).toHaveBeenCalledWith(input.levelId);
        expect(domains.player.findAllByIds).toHaveBeenCalledWith(playerIds);
        expect(domains.gameplayPlayer.bulkCreate).toHaveBeenCalledWith({
          gameplayId: mockNewGameSession.id,
          playerIds
        }, mockTransaction);
        expect(result).toEqual({
          id: 2,
          players: {
            attackerId: players[0].id,
            defenderId: players[1].id,
          },
        });
      });
    });

    describe('invalid', () => {
      it('should return status 400 when not enough players to play', async () => {
        try {
          await gameplay.create({});
        } catch (error) {
          const { statusCode, message } = error;
          const { statusCode: expectCode, message: expectMsg } = ERRORS.VALIDATE.LOBBY_EMPTY;
          expect(statusCode).toEqual(expectCode);
          expect(message).toEqual(expectMsg);
        }
      });
      it.skip('should return status 404 when level to play not found', async () => {});
      it.skip('should return status 400 when found player whose can\'t play', async () => {});
    });
  });
});
