import ArLocal from 'arlocal';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { readFileSync, writeFileSync } from 'fs';
import { createTransaction, createWallet, getBalance } from '../../src';

jest.setTimeout(300000);

describe('Create Transaction', () => {
  it('should create data transaction with bundlr', async () => {
    const generateWallet = await createWallet({
      environment: 'local',
    });

    writeFileSync('wallet1.json', JSON.stringify(generateWallet));

    const { key } = JSON.parse(readFileSync('wallet1.json').toString());

    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key,
      type: 'data',
      environment: 'local',
      data: data,
      options: {
        useBundlr: true,
      },
    });

    console.log('TXN', txn);

    expect(txn).toMatchObject({
      bundlr: {
        currency: 'arweave',
      },
      signer: {
        jwk: key,
      },
    });
  });

  it('should create an arweave data transaction', async () => {
    const generateWallet = await createWallet({
      environment: 'local',
    });

    writeFileSync('wallet1.json', JSON.stringify(generateWallet));

    const { key } = JSON.parse(readFileSync('wallet1.json').toString());

    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key,
      data: data,
      type: 'data',
      environment: 'local',
    });

    expect(txn).toHaveProperty('id');
    expect(txn).toHaveProperty('format');
    expect(txn).toHaveProperty('last_tx');
    expect(txn).toMatchObject({
      format: 2,
      id: '',
      signature: '',
      quantity: '0',
    });
  });

  it('should create, sign and post an arweave data transaction', async () => {
    const generateWallet = await createWallet({
      environment: 'local',
    });

    writeFileSync('wallet1.json', JSON.stringify(generateWallet));

    const { key } = JSON.parse(readFileSync('wallet1.json').toString());

    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    const txn = await createTransaction({
      key,
      data: data,
      type: 'data',
      environment: 'local',
      options: {
        signAndPost: true,
      },
    });

    expect(txn).toHaveProperty('transaction');
    expect(txn).toHaveProperty('postedTransaction');
    expect(txn).toMatchObject({
      transaction: {
        format: 2,
        quantity: '0',
        target: '',
      },
    });
  });

  it('should add tags to a transaction', async () => {
    const generateWallet = await createWallet({
      environment: 'local',
    });

    writeFileSync('wallet1.json', JSON.stringify(generateWallet));

    const { key } = JSON.parse(readFileSync('wallet1.json').toString());

    const data = readFileSync('__tests__/transaction/data/test.json', 'utf-8');

    // bundlr txn
    const bundlrTxn = await createTransaction({
      data,
      key,
      type: 'data',
      environment: 'local',
      options: {
        tags: [{ name: 'test', value: 'jest' }],
        useBundlr: true,
      },
    });

    // arweave txn
    const arweaveTxn = await createTransaction({
      data,
      key,
      type: 'data',
      environment: 'local',
      options: {
        tags: [{ name: 'test-arweave', value: 'jest2' }],
      },
    });

    expect(bundlrTxn).toMatchObject({
      bundlr: {
        currency: 'arweave',
      },
      signer: {
        jwk: key,
      },
    });

    expect(arweaveTxn).toHaveProperty('id');
    expect(arweaveTxn).toHaveProperty('format');
    expect(arweaveTxn).toHaveProperty('last_tx');
    expect(arweaveTxn).toMatchObject({
      format: 2,
      id: '',
      signature: '',
      quantity: '0',
      tags: [
        { name: 'UGVybWF3ZWJKUw', value: 'MS4wLjA' },
        { name: 'dGVzdC1hcndlYXZl', value: 'amVzdDI' },
      ],
    });
  });

  it('should create a wallet transaction', async () => {
    const senderWallet = await createWallet({
      environment: 'local',
    });

    const receiverWallet = await createWallet({
      environment: 'local',
    });

    writeFileSync('wallet2.json', JSON.stringify(senderWallet));
    writeFileSync('wallet3.json', JSON.stringify(receiverWallet));

    const { key: senderKey, walletAddress: senderAddress } = JSON.parse(
      readFileSync('wallet2.json').toString()
    );

    const { walletAddress: receiverAddress } = JSON.parse(
      readFileSync('wallet3.json').toString()
    );

    const balance = await getBalance({
      address: senderAddress,
      environment: 'local',
    });

    const txn = await createTransaction({
      key: senderKey,
      type: 'wallet',
      quantity: '1.000000000000',
      target: receiverAddress,
      environment: 'local',
    });

    expect(balance).toBe('1.000000000000');
    expect(txn).toMatchObject({
      format: 2,
      target: receiverAddress,
      quantity: '1.000000000000',
    });
  });
});
