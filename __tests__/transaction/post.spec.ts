import {
  createTransaction,
  postTransaction,
  signTransaction,
  createWallet,
} from '../../src';
import { readFileSync, writeFileSync } from 'fs';
import Transaction from 'arweave/node/lib/transaction';
import BundlrTransaction from '@bundlr-network/client/build/common/transaction';

describe('Post Arweave Transaction', () => {
  it('should post an arweave data transaction', async () => {
    const generateWallet = await createWallet({
      environment: 'local',
    });

    writeFileSync('wallet1.json', JSON.stringify(generateWallet));

    const { key } = JSON.parse(readFileSync('wallet1.json').toString());

    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key,
      data,
      type: 'data',
      environment: 'local',
    });

    const signedTxn = await signTransaction({
      key,
      environment: 'local',
      createdTransaction: txn as Transaction,
    });

    const postedTxn = await postTransaction({
      key,
      environment: 'local',
      transaction: signedTxn,
    });

    expect(postedTxn).toBeDefined();
    expect(typeof postedTxn).toBe('object');
    expect(postedTxn.status).toBe(200);
    expect(postedTxn.statusText).toBe('OK');
  });

  it('should post a bundlr data transaction', async () => {
    const generateWallet = await createWallet({
      environment: 'local',
    });

    writeFileSync('wallet1.json', JSON.stringify(generateWallet));

    const { key } = JSON.parse(readFileSync('wallet1.json').toString());

    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn: BundlrTransaction = (await createTransaction({
      key,
      data,
      type: 'data',
      environment: 'local',
      options: {
        useBundlr: true,
      },
    })) as BundlrTransaction;

    await signTransaction({
      key,
      useBundlr: true,
      environment: 'local',
      createdTransaction: txn as BundlrTransaction,
    });

    const postedTxn = await postTransaction({
      key,
      useBundlr: true,
      environment: 'local',
      transaction: txn,
    });

    expect(postedTxn).toBeDefined();
    expect(typeof postedTxn).toBe('object');
    expect(postedTxn).toHaveProperty('id');
    expect(postedTxn).toHaveProperty('timestamp');
  });
});
