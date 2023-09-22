import { readFileSync } from 'fs';
import { createTransaction } from '../../src';
import { appVersionTag } from '../../src/utils';
import { decodeTags, getWallet } from './utils';
import { JWKInterface } from 'arweave/node/lib/wallet';

jest.setTimeout(300000);

jest.mock('../../src/utils', () => {
  const version = JSON.parse(
    readFileSync('./package.json', { encoding: 'utf-8' })
  ).version;
  return {
    ...jest.requireActual('../../src/utils'),
    appVersionTag: { name: 'ArweaveKit', value: version },
  };
});

describe('Create Transaction', () => {
  let key: JWKInterface, data: string;

  beforeAll(async () => {
    key = await getWallet('local');
    data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');
  });

  it('should create data transaction with Arweave', async () => {
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

  it('should create data transaction and post to Bundlr', async () => {
    const { NodeBundlr } = await import('@bundlr-network/client');
    const bundlr = new NodeBundlr(
      'https://node2.bundlr.network',
      'arweave',
      key
    );

    // Mock the createTransaction method of NodeBundlr
    const transaction = bundlr.createTransaction(data);
    const createTransactionMock = jest.spyOn(
      NodeBundlr.prototype,
      'createTransaction'
    );
    createTransactionMock.mockReturnValue(transaction);

    // Mock the upload method of the transaction object
    const uploadMock = jest.spyOn(transaction, 'upload');
    uploadMock.mockReturnValue(Promise.resolve({ id: 'ID', timestamp: 123 }));

    const txn = await createTransaction({
      key: key,
      type: 'data',
      environment: 'mainnet',
      data: data,
      options: {
        useBundlr: true,
        signAndPost: true,
      },
    });

    expect(txn).toBeDefined();
    expect(txn.postedTransaction.id).toBeDefined();
    expect(txn.transaction.signature).toBeDefined();

    // Verify the mocks were called as expected
    expect(createTransactionMock).toHaveBeenCalledWith(data, {
      tags: [appVersionTag],
    });
    expect(uploadMock).toHaveBeenCalled();

    // Reset the mocks after your test
    createTransactionMock.mockRestore();
    uploadMock.mockRestore();
  });
});
