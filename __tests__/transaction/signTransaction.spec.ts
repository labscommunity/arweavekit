import { readFileSync } from 'fs';
import { createTransaction, signTransaction } from '../../src';
import { decodeTags, getWallet } from './utils';
import { appVersionTag } from '../../src/utils';
import { JWKInterface } from 'arweave/node/lib/wallet';

jest.setTimeout(300000);

describe('Create Transaction', () => {
  let key: JWKInterface;

  beforeAll(async () => {
    key = await getWallet('local');
  });

  it('should create and sign data transaction with Arweave', async () => {
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
    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key: key,
      type: 'data',
      environment: 'local',
      data: data,
    });

    const signedTransaction = await signTransaction({
      createdTransaction: txn,
      environment: 'local',
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
