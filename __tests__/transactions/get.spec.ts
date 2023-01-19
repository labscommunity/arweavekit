import { createTransaction } from '../../src';
import { readFileSync, writeFileSync, unlink } from 'fs';

jest.setTimeout(300000);

// todo - figure out the whole TXN ID situation

describe('Create Transaction', () => {
  it('should get transaction status with bundlr txn', async () => {
    const { key } = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({
      data: '__tests__/transactions/data/test.json',
      key: key,
      options: { useBundlr: true },
    });

    writeFileSync(
      '__tests__/transactions/data/txn-bundlr.json',
      JSON.stringify(txn)
    );

    const readTXN = JSON.parse(
      readFileSync('__tests__/transactions/data/txn-bundlr.json').toString()
    );

    // todo - get transaction

    console.log('TXN', readTXN.owner);
  });

  it('should get transaction status with arweave txn', async () => {
    const { key } = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({
      data: '__tests__/transactions/data/test.json',
      key: key,
    });

    writeFileSync(
      '__tests__/transactions/data/txn-arweave.json',
      JSON.stringify(txn)
    );

    const readTXN = JSON.parse(
      readFileSync('__tests__/transactions/data/txn-bundlr.json').toString()
    );

    // todo - get transaction

    console.log('TXN', readTXN);
  });
});

afterAll(() => {
  unlink('__tests__/transactions/data/txn-bundlr.json', () => {});
  unlink('__tests__/transactions/data/txn-arweave.json', () => {});
});
