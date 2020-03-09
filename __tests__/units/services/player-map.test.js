describe('services/player-map', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('create attack', () => {
    describe('valid', () => {
      it('should return miss when not hit any ship', () => {});
      it('should return hit when hit any part of the ship', () => {});
      it('should return ship sank when hit last part of the ship', () => {});
      it('should return game end when hit last part of the last ship', () => {});
    });
    describe('invalid', () => {
      it('should throw error when attack not exist game session', () => { });
      it('should throw error when attacker not in game session', () => {});
      it('should throw error when attack end game session', () => { });
      it('should throw error when attack in plan phase', () => { });
      it('should throw error when attack outside map area', () => { });
      it('should throw error when attack when not attacker turn', () => { });
    });
  });
});
