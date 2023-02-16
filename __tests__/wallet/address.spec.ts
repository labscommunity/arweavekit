import { getAddress, createWallet } from '../../src';

jest.setTimeout(300000);

describe('Get Address', () => {
  it('should return wallet address', async () => {
    const { key } = await createWallet();

    if (key) {
      const address = await getAddress(key);

      expect(address).toBeDefined();
      expect(typeof address).toBe('string');
    }
  });
});
