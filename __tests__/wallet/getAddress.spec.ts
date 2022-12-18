const { getAddress } = require('../../src/index');

describe('Get Address', () => {
  jest.setTimeout(300000);

  it('should return wallet address', async () => {
    const { key } = await createWallet();

    if (key) {
      const address = await getAddress(key);

      expect(address).toBeDefined();
      expect(typeof address).toBe('string');
    }
  });

  it('should return error message if key is not passed in', async () => {
    const address = await getAddress();

    expect(address).toBe('enter private key as argument');
  });
});
