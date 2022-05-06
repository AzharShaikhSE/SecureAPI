const assert = require('assert');
const {
  insertHotsauces,
  getHotsauces,
  getHotsauce,
  updateHotsauce,
  deleteHotsauce,
} = require('../../src/services/hotsauce.service');

describe('HotsauceService', () => {
  describe('getHotsauces', () => {
    it('should return all hotsauces', async () => {
      const hotsauces = await getHotsauces();
      assert.equal(hotsauces.length, 0);
    });
  });
  describe('insertHotsauces', () => {
    it('should insert a new hotsauce', async () => {
      const hotsauce = [
        {
          brandName: 'Hotsauce',
          sauceName: 'Hotsauce',
          description: 'This is a test hotsauce',
          heat: '100',
        },
      ];
      await insertHotsauces(hotsauce);
      const hotsauces = await getHotsauces();
      assert.equal(hotsauces.length, 1);
    });
  });
});
