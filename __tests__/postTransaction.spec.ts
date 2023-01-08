import { createTransaction, postTransaction, signTransaction } from "../src/common/transaction";
import { readFileSync } from 'fs';

describe('Post Arweave Transaction', () => {
  it('should post a data transaction', async () => {
    // TODO
    const key = JSON.parse(readFileSync('wallet2.json').toString());
    const txn = await createTransaction({ data: '../__tests__/testAssets/jsonTest.json', key: key });

    const signedTxn = await signTransaction({
      createdTransaction: txn,
      key: key
    });

    const postedTxn = await postTransaction({
      transaction: signedTxn
    })

    expect(postedTxn).toBeDefined();
    expect(typeof postedTxn).toEqual('object');
    expect(postedTxn.status).toEqual(200);
    expect(postedTxn.statusText).toEqual('OK');
  });

  it('should post a data transaction using bundlr', async () => {
    // TODO
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({ data: '../__tests__/testAssets/jsonTest.json', key: key, options: { useBundlr: true } });

    const signedTxn = await signTransaction({
      createdTransaction: txn,
      key: key,
      useBundlr: true
    });

    const postedTxn = await postTransaction({
      transaction: txn,
      key: key,
      useBundlr: true
    });

    expect(postedTxn).toBeDefined();
    expect(typeof postedTxn).toEqual('object');
    expect(postedTxn).toHaveProperty('id');
    expect(postedTxn).toHaveProperty('timestamp');
  });
});