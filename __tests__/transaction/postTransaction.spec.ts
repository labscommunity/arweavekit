import { readFileSync } from 'fs';
import { createTransaction, signTransaction, postTransaction } from '../../src';
import { decodeTags, getWallet } from './utils';
import { appVersionTag } from '../../src/utils';
import Arweave from 'arweave';

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
  it('should create and sign data transaction with Arweave', async () => {
    const key = await getWallet('local');

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
    });

    const arweave = Arweave.init({
      host: 'localhost',
      port: 1984,
      protocol: 'http',
    });

    const walletAddress = await arweave.wallets.jwkToAddress(key);

    await arweave.api
      .get(`mint/${walletAddress}/1000000000000`)
      .catch((error) => console.error(error));

    const postedTransaction = await postTransaction({
      transaction: txn,
      environment: 'local',
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
