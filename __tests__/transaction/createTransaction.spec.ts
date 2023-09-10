import { readFileSync } from 'fs';
import { createTransaction } from '../../src';
import { appVersionTag } from '../../src/utils';
import { decodeTags, getWallet } from './utils';
import { JWKInterface } from 'arweave/node/lib/wallet';

jest.setTimeout(300000);

describe('Create Transaction', () => {
  let key: JWKInterface;

  beforeAll(async () => {
    key = await getWallet('local');
  });

  it('should create data transaction with Arweave', async () => {
    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key,
      type: 'data',
      environment: 'mainnet',
      data: data,
    });

    expect(txn).toBeDefined();
    expect(txn.id).toEqual('');
    expect(decodeTags(txn.tags)).toEqual([appVersionTag]);
  });

  it('should create data transactionand post to Arweave', async () => {
    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key: key,
      type: 'data',
      environment: 'local',
      data: data,
      options: {
        signAndPost: true,
      },
    });

    expect(txn).toBeDefined();
    expect(txn.transaction.id).toBeDefined();
    expect(txn.transaction.signature).toBeDefined();
    expect(txn.postedTransaction.status).toEqual(200);
    expect(txn.postedTransaction.statusText).toEqual('OK');
    expect(decodeTags(txn.transaction.tags)).toEqual([appVersionTag]);
  });
});
