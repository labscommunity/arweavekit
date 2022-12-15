it const { createWallet, getAddress } = require('../src/common/wallet');

describe('Create Wallet', () => {
  jest.setTimeout(300000); // takes a while to generate seedPhrase

  it('should create wallet without options.seedPhrase passed in', async () => {
    const generateWallet = await createWallet();

    expect(generateWallet.key).toBeDefined();
    expect(generateWallet.seedPhrase).toBeNull;
    expect(generateWallet.walletAddress).toBeDefined();
  });

  it('should create wallet with options.seedPhrase passed in', async () => {
    const generateWallet = await createWallet({ seedPhrase: true });

    expect(generateWallet.key).toBeDefined();
    expect(generateWallet.seedPhrase).toBeDefined();
    expect(generateWallet.walletAddress).toBeDefined();
  });
});

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
