import { readFileSync } from 'fs';
import { createTransaction, signTransaction } from '../../src';
import { decodeTags, getArweave, getWallet } from './utils';
import { appVersionTag } from '../../src/utils';
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

describe('Sign Transaction', () => {
  let key: JWKInterface, data: string;

  beforeAll(async () => {
    key = await getWallet('local');
    data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');
  });

  it('should create and sign data transaction with Arweave', async () => {
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

    expect(signedTransaction).toBeDefined();
    expect(txn.signature).toBeDefined();
    expect(decodeTags(txn.tags)).toEqual([appVersionTag]);
  });

  it('should create and sign wallet transaction with Arweave', async () => {
    const arweave = await getArweave('local');
    const senderWallet = await getWallet('local', true);
    const receiverWallet = await getWallet('local', true);
    const receiverAddress = await arweave.wallets.getAddress(receiverWallet);
    const sendQuantity = arweave.ar.arToWinston('0.5');

    const txn = await createTransaction({
      key: senderWallet,
      type: 'wallet',
      environment: 'local',
      quantity: sendQuantity,
      target: receiverAddress,
    });

    const signedTransaction = await signTransaction({
      createdTransaction: txn,
      environment: 'local',
      key: senderWallet,
    });

    expect(signedTransaction).toBeDefined();
    expect(txn.signature).toBeDefined();
    expect(txn.id).toBeDefined();
    expect(txn.target).toBe(receiverAddress);
    expect(txn.quantity).toEqual(sendQuantity);
    expect(decodeTags(txn.tags)).toEqual([appVersionTag]);
  });

  it('should create and sign data transaction and post to Arweave', async () => {
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

  it('should create and sign wallet transaction and post to Arweave', async () => {
    const arweave = await getArweave('local');
    const receiverWallet = await getWallet('local', true);
    const receiverAddress = await arweave.wallets.getAddress(receiverWallet);
    const sendQuantity = arweave.ar.arToWinston('0.5');

    const txn = await createTransaction({
      key: key,
      type: 'wallet',
      environment: 'local',
      quantity: sendQuantity,
      target: receiverAddress,
    });

    let beforeReceiverBalance = await arweave.wallets.getBalance(
      receiverAddress
    );

    const signedTransaction = await signTransaction({
      createdTransaction: txn,
      environment: 'local',
      key: key,
      postTransaction: true,
    });

    let afterReceiverBalance = await arweave.wallets.getBalance(
      receiverAddress
    );

    expect(signedTransaction).toBeDefined();
    expect(signedTransaction.createdTransaction.id).toBeDefined();
    expect(signedTransaction.createdTransaction.signature).toBeDefined();
    expect(signedTransaction.postedTransaction.status).toEqual(200);
    expect(decodeTags(signedTransaction.createdTransaction.tags)).toEqual([
      appVersionTag,
    ]);
    expect(signedTransaction.createdTransaction.target).toBe(receiverAddress);
    expect(signedTransaction.createdTransaction.quantity).toEqual(sendQuantity);
    expect(parseInt(beforeReceiverBalance) + parseInt(sendQuantity)).toEqual(
      parseInt(afterReceiverBalance)
    );
  });
});
