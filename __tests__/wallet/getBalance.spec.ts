import { createWallet, getBalance } from '../../src/lib/wallet';

jest.setTimeout(120000);

describe('Get Balance', () => {
  it('should return wallet balance in Winston', async () => {
    const balance = await getBalance({
      address: 'jPpGVmIlub48bIU9LM3gV2BcT599KEooh8uoNpOn2yo',
      environment: 'mainnet',
    });
    expect(balance).toBe('498733306154');
  });

  it('should return wallet balance in Ar', async () => {
    const balance = await getBalance({
      address: 'jPpGVmIlub48bIU9LM3gV2BcT599KEooh8uoNpOn2yo',
      environment: 'mainnet',
      options: {
        winstonToAr: true,
      }
    });
    expect(balance).toBe('0.498733306154');
  });

  it('should create  and return wallet balance', async () => {
    const { walletAddress } = await createWallet({
      environment: 'local',
    });
    const balance = await getBalance({
      address: walletAddress,
      environment: 'local',
    });
    expect(balance).toBe('1000000000000');
  });
});
