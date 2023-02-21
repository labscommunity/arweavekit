import { createTransaction, signTransaction } from '../../src';
import { readFileSync } from 'fs';
import Transaction from 'arweave/node/lib/transaction';

jest.setTimeout(30000);

describe('Sign Arweave Transaction', () => {
  it('should sign a data transaction', async () => {
    // TODO
    const { key } = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({
      data: '__tests__/transactions/data/test.json',
      key: key,
    });

    const signedTxn = await signTransaction({
      createdTransaction: txn as Transaction,
      key: key,
    });

    expect(signedTxn.data).toBeDefined();
    expect(signedTxn.signature).toBeDefined();
    expect(typeof signedTxn.data).toBe('object');
    expect(typeof signedTxn.signature).toBe('string');
  });

  it('should sign a wallet to wallet transaction', async () => {
    const { key } = JSON.parse(readFileSync('wallet2.json').toString());
    const txn = await createTransaction({
      target: 'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY',
      quantity: '1000000',
      key: key,
    });

    const signedTxn = await signTransaction({
      createdTransaction: txn as Transaction,
      key: key,
    });

    expect(signedTxn.signature).toBeDefined();
    expect(signedTxn.target).toBe(
      'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY'
    ); // todo
    expect(signedTxn.quantity).toBe('1000000'); // todo
    expect(typeof signedTxn.target).toBe('string');
    expect(typeof signedTxn.quantity).toBe('string');
    expect(typeof signedTxn.signature).toBe('string');
  });

  it('should sign a data transaction using bundlr', async () => {
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

    expect(signedTxn).toBeDefined();
    expect(typeof signedTxn).toEqual('object');
  });

  it('should post a data transaction', async () => {
    // TODO - ADD FUNDS TO WALLET 2

    const { key } = JSON.parse(readFileSync('wallet2.json').toString());
    const txn = await createTransaction({
      data: '__tests__/transactions/data/test.json',
      key: key,
    });

    const signedTxn = await signTransaction({
      createdTransaction: txn as Transaction,
      key: key,
      postTransaction: true,
    });

    expect(signedTxn.postedTransaction).toBeDefined();
    expect(typeof signedTxn.postedTransaction).toEqual('object');
    expect(signedTxn.postedTransaction.status).toEqual(200);
    expect(signedTxn.postedTransaction.statusText).toEqual('OK');
  });

  it('should post a data transaction using bundlr', async () => {
    const { key } = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({
      data: '__tests__/transactions/data/test.jsonn',
      key: key,
      options: { useBundlr: true },
    });

    const signedTxn = await signTransaction({
      createdTransaction: txn as Transaction,
      key: key,
      useBundlr: true,
      postTransaction: true,
    });

    expect(signedTxn).toBeDefined();
    expect(typeof signedTxn).toBe('object');
    expect(signedTxn.postedTransaction).toBeDefined();
    expect(typeof signedTxn.postedTransaction).toBe('object');
    expect(signedTxn.transaction).toBeDefined();
    expect(signedTxn.postedTransaction).toHaveProperty('id');
    expect(signedTxn.postedTransaction).toHaveProperty('timestamp');
  });
});
