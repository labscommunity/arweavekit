import { createTransaction, postTransaction, signTransaction } from '../../src';
import { readFileSync } from 'fs';
import Transaction from 'arweave/node/lib/transaction';

describe('Post Arweave Transaction', () => {
  it('should post a data transaction', async () => {
    const { key } = JSON.parse(readFileSync('wallet2.json').toString());
    const txn = await createTransaction({
      data: '../__tests__/testAssets/jsonTest.json',
      key: key,
    });

    const signedTxn = await signTransaction({
      createdTransaction: txn as Transaction,
      key: key,
    });

    const postedTxn = await postTransaction({
      transaction: signedTxn,
    });

    expect(postedTxn).toBeDefined();
    expect(typeof postedTxn).toBe('object');
    expect(postedTxn.status).toBe(200);
    expect(postedTxn.statusText).toBe('OK');
  });

  it('should post a data transaction using bundlr', async () => {
    // TODO
    const { key } = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({
      data: '__tests__/transactions/data/test.json',
      key: key,
      options: { useBundlr: true },
    });

    const signedTxn = await signTransaction({
      createdTransaction: txn as Transaction,
      key: key,
      useBundlr: true,
    });

    const postedTxn = await postTransaction({
      transaction: txn as Transaction,
      key: key,
      useBundlr: true,
    });

    expect(postedTxn).toBeDefined();
    expect(typeof postedTxn).toBe('object');
    expect(postedTxn).toHaveProperty('id');
    expect(postedTxn).toHaveProperty('timestamp');
  });
});
