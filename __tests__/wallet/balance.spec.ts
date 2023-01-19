<<<<<<< HEAD:__tests__/wallet.spec.ts
import { createWallet, getBalance, getAddress } from '../src/common/wallet';

jest.setTimeout(120000); // takes a while to generate seedPhrase

describe('Create Wallet', () => {
  it('should create wallet without options.seedPhrase passed in', async () => {
    const generateWallet = await createWallet();

    expect(generateWallet.key).toBeDefined();
    expect(generateWallet.seedPhrase).toBeNull;
    expect(generateWallet.walletAddress).toBeDefined();
  });

  it('should create wallet with options.seedPhrase passed in', async () => {
    const generateWallet = await createWallet({
      options: {
        seedPhrase: true,
      },
    });

    expect(generateWallet.key).toBeDefined();
    expect(generateWallet.seedPhrase).toBeDefined();
    expect(generateWallet.walletAddress).toBeDefined();
  });
});

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
=======
import { createWallet, getBalance } from '../../src/common/wallet';
>>>>>>> main:__tests__/wallet/balance.spec.ts

describe('Get Balance', () => {
  it('should return undefined when wallet address is not passed in', async () => {
    const walletBalance = await getBalance('');

    expect(walletBalance).toEqual(
      'Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).'
    );
  });

  it('should return undefined when wallet address passed in is less than 43 characters', async () => {
    const walletBalance = await getBalance('y7sDPMTIcbvIWxSXSxrDvHldL');

    expect(walletBalance).toEqual(
      'Entered wallet address is less than 43 characters. Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).'
    );
  });

  it('should return a balance when wallet address is passed in', async () => {
    const walletBalance = await getBalance(
      'y7sDPMTIcbvIWxSXSxrDvHldL5iN8zh5RMrCDaTQFAM'
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
