import { createTransaction } from '../../src';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';

jest.setTimeout(300000);

// todo - figure out the whole TXN ID situation

let txn: any;

beforeAll(async () => {
  const { key } = JSON.parse(readFileSync('wallet1.json').toString());
  txn = await createTransaction({
    data: '__tests__/transactions/data/test.json',
    key: key,
    options: { useBundlr: true },
  });
});

describe('Create Transaction', () => {
  it('should get transaction status with bundlr txn', async () => {
    writeFileSync(
      '__tests__/transactions/data/txn-bundlr.json',
      JSON.stringify(txn)
    );

    const readTxn = JSON.parse(
      readFileSync('__tests__/transactions/data/txn-bundlr.json').toString()
    );
    // todo - get transaction

    console.log('TXN', readTxn);
  });

  it('should get transaction status with arweave txn', async () => {
    writeFileSync(
      '__tests__/transactions/data/txn-arweave.json',
      JSON.stringify(txn)
    );

    const readTxn = JSON.parse(
      readFileSync('__tests__/transactions/data/txn-arweave.json').toString()
    );
    // todo - get transaction

    console.log('TXN', readTxn);
  });
});

afterAll(() => {
  unlinkSync('__tests__/transactions/data/txn-bundlr.json');
  unlinkSync('__tests__/transactions/data/txn-arweave.json');
});
