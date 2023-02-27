import { getAddress, createWallet } from '../../src';

jest.setTimeout(300000);

describe('Get Address', () => {
  it('should return wallet address', async () => {
    const { key } = await createWallet({
      environment: 'testnet',
    });

    if (key) {
      const address = await getAddress({
        key,
        environment: 'testnet',
      });

      expect(address).toBeDefined();
      expect(typeof address).toBe('string');
    }
  });
});
