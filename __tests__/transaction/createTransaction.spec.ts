import { readFileSync } from 'fs';
import { createTransaction, createWallet } from '../../src';

jest.setTimeout(300000);

describe('Create Transaction', () => {
  it('should create data transaction with Arweave', async () => {
    const generateWallet = await createWallet({
      environment: 'mainnet',
    });

    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key: generateWallet.key,
      type: 'data',
      environment: 'mainnet',
      data: data,
    });

    expect(txn).toBeDefined();
    expect(txn.id).toEqual('');
    expect(txn.tags).toEqual([{ name: 'QXJ3ZWF2ZUtpdA', value: 'MS40Ljc' }]);
  });

  it('should create data transactionand post to Arweave', async () => {
    // Needs to be a funded wallet.json
    // Else error Txn headers undefined
    const key = JSON.parse(readFileSync('wallet.json').toString());

    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key: key,
      type: 'data',
      environment: 'mainnet',
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
    expect(txn.transaction.tags).toEqual([
      { name: 'QXJ3ZWF2ZUtpdA', value: 'MS40Ljc' },
    ]);
  });
});
