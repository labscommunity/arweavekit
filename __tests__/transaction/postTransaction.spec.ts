import { readFileSync } from 'fs';
import { createTransaction, signTransaction, postTransaction } from '../../src';
import { decodeTags, getArweave, getWallet } from './utils';
import { appVersionTag } from '../../src/utils';

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

describe('Post Transaction', () => {
  it('should create, sign and post data transaction with Arweave', async () => {
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

  it('should create, sign and post wallet transaction with Arweave', async () => {
    const senderKey = await getWallet('local');
    const receiverKey = await getWallet('local', true);
    const arweave = await getArweave('local');

    const receiverAddress = await arweave.wallets.getAddress(receiverKey);
    const sendQuantity = arweave.ar.arToWinston('0.5');

    const txn = await createTransaction({
      key: senderKey,
      type: 'wallet',
      environment: 'local',
      quantity: sendQuantity,
      target: receiverAddress,
    });

    const signedTransaction = await signTransaction({
      createdTransaction: txn,
      environment: 'local',
      key: senderKey,
    });

    let beforeReceiverBalance = await arweave.wallets.getBalance(
      receiverAddress
    );

    const postedTransaction = await postTransaction({
      transaction: txn,
      environment: 'local',
    });

    let afterReceiverBalance = await arweave.wallets.getBalance(
      receiverAddress
    );

    expect(postedTransaction).toBeDefined();
    expect(postedTransaction.transaction.id).toBeDefined();
    expect(postedTransaction.transaction.signature).toBeDefined();
    expect(postedTransaction.postedTransaction.status).toEqual(200);
    expect(decodeTags(postedTransaction.transaction.tags)).toEqual([
      appVersionTag,
    ]);
    expect(postedTransaction.transaction.target).toBe(receiverAddress);
    expect(postedTransaction.transaction.quantity).toEqual(sendQuantity);
    expect(parseInt(beforeReceiverBalance)).toBeLessThan(
      parseInt(afterReceiverBalance)
    );
  });
});
