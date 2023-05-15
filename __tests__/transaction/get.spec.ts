import { createTransaction, createWallet, getTransaction } from '../../src';
import { readFileSync, writeFileSync } from 'fs';
import Transaction from 'arweave/node/lib/transaction';

jest.setTimeout(300000);

describe('Create Transaction', () => {
  it('should get arweave transaction', async () => {
    const generateWallet = await createWallet({
      environment: 'local',
    });
    writeFileSync('wallet1.json', JSON.stringify(generateWallet));
    const { key } = JSON.parse(readFileSync('wallet1.json').toString());
    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');
    const txn = await createTransaction({
      type: 'data',
      environment: 'local',
      data: data,
      key: key,
      options: {
        signAndPost: true,
      },
    });
    writeFileSync('testTxn.json', JSON.stringify(txn));
    const { id: txnId } = JSON.parse(
      readFileSync('testTxn.json').toString()
    ).transaction;
    const getTxn = await getTransaction({
      environment: 'local',
      transactionId: txnId,
    });
    expect(getTxn).toBeDefined();
    expect(getTxn).toHaveProperty('id');
    expect(getTxn).toHaveProperty('created_at');
    expect(getTxn).toMatchObject({
      format: 2,
      id: txnId,
      target: '',
    });
  });
});
