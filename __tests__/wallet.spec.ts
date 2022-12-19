import { getBalance } from '../src/common/wallet';

const { createWallet, getAddress } = require('../src/common/wallet');

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

describe('Get Balance', () => {
  it('should return undefined when wallet address is not passed in', async () => {
    const walletBalance = await getBalance({ walletAddress: '' });

    expect(walletBalance).toEqual(
      'Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).'
    );
  });

  it('should return undefined when wallet address passed in is less than 43 characters', async () => {
    const walletBalance = await getBalance({
      walletAddress: 'y7sDPMTIcbvIWxSXSxrDvHldL',
    });

    expect(walletBalance).toEqual(
      'Entered wallet address is less than 43 characters. Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).'
    );
  });

  it('should return a balance when wallet address is passed in', async () => {
    const walletBalance = await getBalance({
      walletAddress: 'y7sDPMTIcbvIWxSXSxrDvHldL5iN8zh5RMrCDaTQFAM',
    });

    expect(typeof parseInt(walletBalance)).toEqual('number');
    expect(parseInt(walletBalance)).toBeGreaterThan(0);
  });

  it('should return a balance when wallet address is passed in', async () => {
    jest.setTimeout(300000); // takes a while to generate seedPhrase

    const generateWallet = await createWallet({ seedPhrase: false }); // generates fresh wallet to test 0 balance cases
    const walletBalance = await getBalance({
      walletAddress: generateWallet.walletAddress,
    });

    expect(typeof parseInt(walletBalance)).toEqual('number');
    expect(parseInt(walletBalance)).toEqual(0);
  });
});
