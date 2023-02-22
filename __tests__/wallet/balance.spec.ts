import { createWallet, getBalance } from '../../src';

jest.setTimeout(120000);

describe('Get Balance', () => {
  it('should return a balance when wallet address is passed in', async () => {
    const walletBalance = await getBalance({
      address: 'y7sDPMTIcbvIWxSXSxrDvHldL5iN8zh5RMrCDaTQFAM',
    });

    expect(typeof parseInt(walletBalance)).toEqual('number');
    expect(parseInt(walletBalance)).toBeGreaterThan(0);
  });

  it('should return a balance when wallet address is passed in with local environment', async () => {
    const generateWallet = await createWallet({
      seedPhrase: false,
      environment: 'local',
    });

    const walletBalance = await getBalance({
      address: generateWallet.walletAddress,
      environment: 'local',
    });

    expect(typeof parseInt(walletBalance)).toEqual('number');
    expect(parseInt(walletBalance)).toEqual(1000000000000);
  });
});
