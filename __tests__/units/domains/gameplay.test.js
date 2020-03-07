import models from 'models';
import { gameplay } from 'domains';
import GAME_STATUS from 'constants/gameplay-status';
import { ERRORS } from 'dist/constants/error-format';

jest.mock('models');

describe('domains/gameplay', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    describe('valid', () => {
      it('should create new game session from given level', async () => {
        const input = {
          levelId: 11
        };
        const modelOpt = { foo:'bar'};
        const mockGameplay = { id: 1 };
        models.gameplay.create = jest.fn().mockResolvedValueOnce(mockGameplay);

        const result = await gameplay.create(input, modelOpt);

        expect(models.gameplay.create).toHaveBeenCalledWith({
          levelId: input.levelId,
          status: GAME_STATUS.PLAN
        }, modelOpt);
        expect(result).toEqual(mockGameplay);
      });
    });

    describe('invalid', () => {
      it('should return status 400 when try to create game w/o level', async () => {
        try {
          await gameplay.create({});
        } catch (error) {
          const { statusCode, message } = error;
          const { statusCode: expectCode, message: expectMsg } = ERRORS.VALIDATE.LEVEL_NOT_FOUND;
          expect(statusCode).toEqual(expectCode);
          expect(message).toEqual(expectMsg);
        }
      });
    });
  });
});
