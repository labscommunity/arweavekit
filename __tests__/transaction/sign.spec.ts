import BundlrTransaction from '@bundlr-network/client/build/common/transaction';
import { createTransaction, signTransaction, createWallet } from '../../src';
import { readFileSync, writeFileSync } from 'fs';
import Transaction from 'arweave/node/lib/transaction';

jest.setTimeout(30000);

describe('Sign Arweave Transaction', () => {
  it('should sign an arweave data transaction', async () => {
    const generateWallet = await createWallet({
      environment: 'local',
    });
    writeFileSync('wallet1.json', JSON.stringify(generateWallet));
    const { key } = JSON.parse(readFileSync('wallet1.json').toString());
    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');
    const txn = await createTransaction({
      key,
      data,
      type: 'data',
      environment: 'local',
    });
    const signedTxn = await signTransaction({
      key,
      environment: 'local',
      createdTransaction: txn as Transaction,
    });
    expect(signedTxn.id).toBeDefined();
    expect(signedTxn.last_tx).toBeDefined();
    expect(signedTxn.signature).toBeDefined();
    expect(typeof signedTxn.id).toBe('string');
    expect(typeof signedTxn.signature).toBe('string');
  });

  it('should sign a wallet to wallet transaction', async () => {
    const senderWallet = await createWallet({
      environment: 'local',
    });
    const receiverWallet = await createWallet({
      environment: 'local',
    });
    writeFileSync('wallet2.json', JSON.stringify(senderWallet));
    writeFileSync('wallet3.json', JSON.stringify(receiverWallet));
    const { key: senderKey } = JSON.parse(
      readFileSync('wallet2.json').toString()
    );
    const { walletAddress: receiverAddress } = JSON.parse(
      readFileSync('wallet3.json').toString()
    );
    const txn = await createTransaction({
      key: senderKey,
      type: 'wallet',
      environment: 'local',
      target: receiverAddress,
      quantity: '1.000000000000',
    });
    const signedTxn = await signTransaction({
      key: senderKey,
      environment: 'local',
      createdTransaction: txn as Transaction,
    });
    expect(signedTxn.id).toBeDefined();
    expect(signedTxn.signature).toBeDefined();
    expect(signedTxn.quantity).toBe('1.000000000000');
    expect(signedTxn.target).toBe(`${receiverAddress}`);
    expect(typeof signedTxn.target).toBe('string');
    expect(typeof signedTxn.quantity).toBe('string');
    expect(typeof signedTxn.signature).toBe('string');
  });

  it('should sign a bundlr data transaction', async () => {
    const generateWallet = await createWallet({
      environment: 'local',
    });
    writeFileSync('wallet1.json', JSON.stringify(generateWallet));
    const { key } = JSON.parse(readFileSync('wallet1.json').toString());
    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');
    const txn: BundlrTransaction = (await createTransaction({
      key,
      data,
      type: 'data',
      environment: 'local',
      options: {
        useBundlr: true,
      },
    })) as BundlrTransaction;

    const signedTxn = await signTransaction({
      key,
      useBundlr: true,
      environment: 'local',
      createdTransaction: txn as BundlrTransaction,
    });

    expect(signedTxn).toBeDefined();
    expect(typeof signedTxn).toEqual('object');
  });
});
