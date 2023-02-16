import { createWallet } from '../../src';

jest.setTimeout(300000);

describe('Create Wallet', () => {
  it('should create wallet without options.seedPhrase passed in', async () => {
    const generateWallet = await createWallet();

    expect(generateWallet.key).toBeDefined();
    expect(generateWallet.seedPhrase).toBeNull;
    expect(generateWallet.walletAddress).toBeDefined();
  });

  it('should create wallet with options.seedPhrase passed in', async () => {
    const generateWallet = await createWallet({
      seedPhrase: true,
    });

    expect(generateWallet.key).toBeDefined();
    expect(generateWallet.seedPhrase).toBeDefined();
    expect(generateWallet.walletAddress).toBeDefined();
  });
});
