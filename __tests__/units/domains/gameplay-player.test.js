import models from 'models';
import { gameplayPlayer } from 'domains';
import PLAYER_STATUS from 'constants/player-status';
import { ERRORS } from 'constants/error-format';

jest.mock('models');

describe('domains/gameplayPlayer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('bulkCreate', () => {
    describe('valid', () => {
      it('should return players whose join the game', async () => {
        const gameplayId = 2;
        const playerIds = [ { id: 1 }, { id: 2 } ];
        const input = { gameplayId, playerIds };
        const modelOpt = { foo: 'bar' };
        const mockLobby = [{ id: 2, playerId: 1 }, { id: 3, playerId: 2 }];
        const expectInsertion = [
          {
            gameplayId,
            playerId: playerIds[0],
            status: PLAYER_STATUS.WAIT,
          }, {
            gameplayId,
            playerId: playerIds[1],
            status: PLAYER_STATUS.WAIT,
          }
        ];
        models.gameplayPlayer.bulkCreate = jest.fn().mockResolvedValueOnce(mockLobby);

        const result = await gameplayPlayer.bulkCreate(input, modelOpt);

        expect(models.gameplayPlayer.bulkCreate).toHaveBeenCalledWith(expectInsertion, modelOpt);
        expect(result).toEqual(mockLobby);
      });
    });

    describe('invalid', () => {
      it('should return status 422 when gameplay id is invalid', async () => {
        try {
          await gameplayPlayer.bulkCreate({});
        } catch (error) {
          const { statusCode, message } = error;
          const { statusCode: expectCode, message: expectMsg } = ERRORS.VALIDATE.INVALID_GAME;
          expect(statusCode).toEqual(expectCode);
          expect(message).toEqual(expectMsg);
        }
      });
      it('should return status 422 when no player', async () => {
        try {
          await gameplayPlayer.bulkCreate({ gameplayId: 1});
        } catch (error) {
          const { statusCode, message } = error;
          const { statusCode: expectCode, message: expectMsg } = ERRORS.VALIDATE.INVALID_GAME;
          expect(statusCode).toEqual(expectCode);
          expect(message).toEqual(expectMsg);
        }
      });
      it('should return status 422 when single player', async () => {
        try {
          await gameplayPlayer.bulkCreate({ gameplayId: 1 });
        } catch (error) {
          const { statusCode, message } = error;
          const { statusCode: expectCode, message: expectMsg } = ERRORS.VALIDATE.INVALID_GAME;
          expect(statusCode).toEqual(expectCode);
          expect(message).toEqual(expectMsg);
        }
      });
    });
  });
});
