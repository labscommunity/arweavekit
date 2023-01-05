import { createTransaction, postTransaction, signTransaction } from "../src/common/transaction";
import { readFileSync } from 'fs';

describe('Post Arweave Transaction', () => {
  it('should post a data transaction', async () => {
    // TODO
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({ data: '../__tests__/testAssets/jsonTest.json', key: key });

    const signedTxn = await signTransaction({
      transaction: txn,
      key: key
    });

    const postedTxn = await postTransaction({
      transaction: signedTxn
    });
  });

  it('should post a wallet to wallet transaction', async () => {
    // TODO
    const key = JSON.parse(readFileSync('wallet2.json').toString());
    const txn = await createTransaction({ target: 'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY', quantity: '1000000', key: key });

    const signedTxn = await signTransaction({
      transaction: txn,
      key: key
    });

    const postedTxn = await postTransaction({
      transaction: signedTxn
    });
  });
});