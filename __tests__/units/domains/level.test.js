import models from 'models';
import { level } from 'domains';

jest.mock('models');

describe('domains/level', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('findOneById', () => {
    describe('valid', () => {
      it('should return data from given id', async () => {
        const input = 2;
        const mockLevel = { id: 2 };
        models.level.findByPk = jest.fn().mockResolvedValueOnce(mockLevel);

        const result = await level.findOneById(input);

        expect(models.level.findByPk).toHaveBeenCalledWith(input);
        expect(result).toEqual(mockLevel);
      });

      it('should return nothing from given id', async () => {
        const input = 2;
        models.level.findByPk = jest.fn();
        const result = await level.findOneById(input);

        expect(models.level.findByPk).toHaveBeenCalledWith(input);
        expect(result).toBeUndefined();
      });
    });

    describe('invalid', () => {
    });
  });
});
