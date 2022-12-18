<<<<<<<< HEAD:__tests__/wallet/create.spec.ts
const { createWallet } = require('../../src/index');

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
========
const Transaction = require('arweave/node/lib/transaction');
>>>>>>>> 45ec94d (chore: refactor):__tests__/wallet.spec.ts
