describe('services/player-fleets', () => {
  describe('create', () => {
    describe('empty board', () => {
      describe('valid', () => {
        it('should be able to place a ship in board area', async () => {});
        it('should be able to place a ship at board corner', async () => {});
      });
      describe('invalid', () => {
        it('should not place a ship when out of the board area', async () => {});
        it('should not place a ship when some part out of the board area', async () => {});
      });
    });
    describe('add more ship', () => {
      describe('valid', () => {
        it('should be able to place a ship in board area', async () => { });
      });
      describe('invalid', () => {
        it('should not place a ship when intersect with another ship', async () => {});
      });
    });
  });
});
