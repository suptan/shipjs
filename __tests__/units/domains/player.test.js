import models from 'models';
import { player } from 'domains';

jest.mock('models');

describe('domains/player', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('findAllByIds', () => {
    describe('valid', () => {
      it('should return data from given id', async () => {
        const input = 2;
        const mockPlayer = { id: 2 };
        models.player.findAll = jest.fn().mockResolvedValueOnce(mockPlayer);

        const result = await player.findAllByIds(input);

        expect(models.player.findAll).toHaveBeenCalledWith({
          where: { id: input }
        });
        expect(result).toEqual(mockPlayer);
      });

      it('should return data from given ids', async () => {
        const input = [1, 2];
        const mockPlayer = { id: 2 };
        models.player.findAll = jest.fn().mockResolvedValueOnce(mockPlayer);

        const result = await player.findAllByIds(input);

        expect(models.player.findAll).toHaveBeenCalledWith({
          where: { id: input }
        });
        expect(result).toEqual(mockPlayer);
      });
    });

    describe('invalid', () => {
    });
  });
});
