import { createTransaction, signTransaction } from "../src/common/transaction";
import { readFileSync } from 'fs';

describe('Sign Arweave Transaction', () => {
  it('should sign a data transaction', async () => {
    // TODO
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({ data: '../__tests__/testAssets/jsonTest.json', key: key });

    const signedTxn = await signTransaction({
      createdTransaction: txn,
      key: key
    });

    expect(signedTxn.data).toBeDefined();
    expect(signedTxn.signature).toBeDefined();
    expect(typeof signedTxn.data).toBe('object');
    expect(typeof signedTxn.signature).toBe('string');
  });

  it('should sign a wallet to wallet transaction', async () => {
    // TODO
    const key = JSON.parse(readFileSync('wallet2.json').toString());
    const txn = await createTransaction({ target: 'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY', quantity: '1000000', key: key });

    const signedTxn = await signTransaction({
      createdTransaction: txn,
      key: key
    });

    expect(signedTxn.signature).toBeDefined();
    expect(signedTxn.target).toBe('fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY'); // todo
    expect(signedTxn.quantity).toBe('1000000'); // todo
    expect(typeof signedTxn.target).toBe('string');
    expect(typeof signedTxn.quantity).toBe('string');
    expect(typeof signedTxn.signature).toBe('string');
  });
});