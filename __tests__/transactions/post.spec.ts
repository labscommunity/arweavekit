import {
  createTransaction,
  postTransaction,
  signTransaction,
} from '../../src/common/transaction';
import { readFileSync } from 'fs';
import Transaction from 'arweave/node/lib/transaction';

describe('Post Arweave Transaction', () => {
  it('should post a data transaction', async () => {
    const key = JSON.parse(readFileSync('wallet2.json').toString());
    const data = readFileSync('__tests__/transactions/data/test.json', 'utf-8');
    const txn = await createTransaction({
      data: data,
      key: key,
      options: {
        environment: 'local',
      },
    });

    const signedTxn = await signTransaction({
      createdTransaction: txn as Transaction,
      key: key,
      environment: 'local',
    });

    const postedTxn = await postTransaction({
      transaction: signedTxn,
      environment: 'local',
    });

    expect(postedTxn).toBeDefined();
    expect(typeof postedTxn).toBe('object');
    expect(postedTxn.status).toBe(200);
    expect(postedTxn.statusText).toBe('OK');
  });

  it('should post a data transaction using bundlr', async () => {
    // TODO
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const data = readFileSync('__tests__/transactions/data/test.json', 'utf-8');
    const txn = await createTransaction({
      data: data,
      key: key,
      options: { useBundlr: true },
    });

    await signTransaction({
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
