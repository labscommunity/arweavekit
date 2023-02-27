import { createWallet, getBalance } from '../../src/lib/wallet';

jest.setTimeout(120000);

describe('Get Balance', () => {
  it('should return wallet balance', async () => {
    const balance = await getBalance({
      address: 'jPpGVmIlub48bIU9LM3gV2BcT599KEooh8uoNpOn2yo',
      environment: 'mainnet',
    });
    expect(balance).toBe('0.498733306154');
  });

  it('should create  and return wallet balance', async () => {
    const { walletAddress } = await createWallet({
      environment: 'testnet',
    });
    const balance = await getBalance({
      address: walletAddress,
      environment: 'testnet',
    });
    expect(balance).toBe('0.000000000000');
  });
});
