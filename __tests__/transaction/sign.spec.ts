const { signTransaction } = require('../src/index');

describe('Sign Arweave Transaction', () => {
  it('should sign a transaction given a private key and a transaction', () => {
    // TODO - first create unsigned transaction use createTransaction function **rohit**
  });

  it('should create and sign a data transaction', async () => {
    // TODO
    const transaction = await signTransaction({
      options: { type: 'data', data: '<h1>this is an html string</h1>' },
    });

    expect(transaction.data).toBeDefined();
    expect(transaction.signature).toBeDefined();
    expect(typeof transaction.data).toBe('string');
    expect(typeof transaction.signature).toBe('string');
  });

  it('should create and sign a wallet to wallet transaction', async () => {
    // TODO
    const transaction = signTransaction({
      options: { address: 'wallet', target: '', quantity: '10' },
    });

    expect(transaction.data).toBeDefined();
    expect(transaction.signature).toBeDefined();
    expect(transaction.target).toBe('wallet address'); // todo
    expect(transaction.quantity).toBe('quantity'); // todo
    expect(typeof transaction.data).toBe('string');
    expect(typeof transaction.target).toBe('string');
    expect(typeof transaction.quantity).toBe('string');
    expect(typeof transaction.signature).toBe('string');
  });
});
