import { getAddress, createWallet } from '../../src';

jest.setTimeout(300000);

describe('Get Address', () => {
  it('should return wallet address', async () => {
    const { key } = await createWallet({
      environment: 'local',
    });

    if (key) {
      const address = await getAddress({
        key,
        environment: 'local',
      });

      expect(address).toBeDefined();
      expect(typeof address).toBe('string');
    }
  });
});
