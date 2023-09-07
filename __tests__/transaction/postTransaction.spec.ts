import { readFileSync } from 'fs';
import { createTransaction, signTransaction, postTransaction } from '../../src';
import { decodeTags } from './utils';
import { appVersionTag } from '../../src/utils';

jest.setTimeout(300000);

describe('Create Transaction', () => {
  it('should create and sign data transaction with Arweave', async () => {
    const key = JSON.parse(readFileSync('wallet.json').toString());

    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key: key,
      type: 'data',
      environment: 'mainnet',
      data: data,
    });

    const signedTransaction = await signTransaction({
      createdTransaction: txn,
      environment: 'mainnet',
      key: key,
    });

    const postedTransaction = await postTransaction({
      transaction: txn,
      environment: 'mainnet',
    });

    expect(postedTransaction).toBeDefined();
    expect(postedTransaction.transaction.id).toBeDefined();
    expect(postedTransaction.transaction.signature).toBeDefined();
    expect(postedTransaction.postedTransaction.status).toEqual(200);
    expect(postedTransaction.postedTransaction.statusText).toEqual('OK');
    expect(decodeTags(postedTransaction.transaction.tags)).toEqual([
      appVersionTag,
    ]);
  });
});
