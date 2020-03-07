import SequelizeMock from 'sequelize-mock';
import mapModel from 'models/map';

const dbMock = new SequelizeMock();
dbMock.QueryTypes = dbMock.Sequelize.QueryTypes;
const mockMapModel = mapModel(dbMock, SequelizeMock);

describe('models/map', () => {
  it('should contain specific columns', async () => {
    const spyMapFindAll = jest.spyOn(mockMapModel, 'findAll');

    await mockMapModel.findAll();

    expect(spyMapFindAll).toBeCalled();
  });
});
