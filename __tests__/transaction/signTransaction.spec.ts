import { readFileSync } from 'fs';
import { createTransaction, signTransaction } from '../../src';
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

    console.log(signedTransaction);

    expect(signedTransaction).toBeDefined();
    expect(txn.signature).toBeDefined();
    expect(decodeTags(txn.tags)).toEqual([appVersionTag]);
  });

  it('should create and sign data transactionand post to Arweave', async () => {
    // Needs to be a funded wallet.json
    // Else error Txn headers undefined
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
      postTransaction: true,
    });

    expect(signedTransaction).toBeDefined();
    expect(signedTransaction.createdTransaction.id).toBeDefined();
    expect(signedTransaction.createdTransaction.signature).toBeDefined();
    expect(signedTransaction.postedTransaction.status).toEqual(200);
    expect(signedTransaction.postedTransaction.statusText).toEqual('OK');
    expect(decodeTags(signedTransaction.createdTransaction.tags)).toEqual([
      appVersionTag,
    ]);
  });
});
