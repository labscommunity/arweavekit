import { createWallet, getBalance } from '../../src';

describe('Get Balance', () => {
  it('should return undefined when wallet address is not passed in', async () => {
    const walletBalance = await getBalance('');

    expect(walletBalance).toEqual(
      'Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).',
    );
  });

  it('should return undefined when wallet address passed in is less than 43 characters', async () => {
    const walletBalance = await getBalance('y7sDPMTIcbvIWxSXSxrDvHldL');

    expect(walletBalance).toEqual(
      'Entered wallet address is less than 43 characters. Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).',
    );
  });

  it('should return a balance when wallet address is passed in', async () => {
    const walletBalance = await getBalance(
      'y7sDPMTIcbvIWxSXSxrDvHldL5iN8zh5RMrCDaTQFAM',
    );

    expect(typeof parseInt(walletBalance)).toEqual('number');
    expect(parseInt(walletBalance)).toBeGreaterThan(0);
  });

  it('should return a balance when wallet address is passed in', async () => {
    const generateWallet = await createWallet({
      options: {
        seedPhrase: false,
      },
    }); // generates fresh wallet to test 0 balance cases
    const walletBalance = await getBalance(generateWallet.walletAddress);

    expect(typeof parseInt(walletBalance)).toEqual('number');
    expect(parseInt(walletBalance)).toEqual(0);
  });
});
