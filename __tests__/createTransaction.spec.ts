import { createTransaction } from "../src/common/transaction";
import { readFileSync } from 'fs';

describe('Create Transaction', () => {
  jest.setTimeout(300000);

  it('should return string asking to call function with valid arguments', async () => {
    const txn = await createTransaction({});

    expect(txn).toEqual('Pass in valid data or token quantity and target to create a transaction.')
  });

  it('should return empty string for owner key in transaction object when no key argument is passed in on fucntion call', async () => {
    const txn = await createTransaction({ data: '../__tests__/testAssets/jsonTest.json' });

    expect(txn).toMatchObject({
      id: '',
      owner: '',
      target: '',
      quantity: '0',
      signature: '',
    });
  });

  it('should return part of owner key in transaction object when both data and key arguments are passed in on function call', async () => {
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({ data: '../__tests__/testAssets/jsonTest.json', key: key });

    expect(txn).toMatchObject({
      id: '',
      owner: key.n,
      target: '',
      quantity: '0',
      signature: '',
    });
  });

  it('should return string asking to call function with valid arguments when target argument is passed in on function call', async () => {
    const txn = await createTransaction({ target: 'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY' });

    expect(txn).toEqual('Pass in valid data or token quantity and target to create a transaction.')
  });

  it('should return string asking to call function with valid arguments when quantity argument is passed in on function call', async () => {
    const txn = await createTransaction({ quantity: '1000000' });

    expect(txn).toEqual('Pass in valid data or token quantity and target to create a transaction.')
  });

  it('should return string alerting insufficient balance when target and quantity, but no key arguments are passed in on function call', async () => {
    const txn = await createTransaction({ target: 'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY', quantity: '1000000' });

    expect(txn).toEqual('Wallet does not have sufficient balance to complete transaction.');
  });

  it('should return string alerting insufficient balance when target, quantity and key arguments are passed in on function call but wallet does not have balance', async () => {
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({ target: 'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY', quantity: '1000000', key: key });

    expect(txn).toEqual('Wallet does not have sufficient balance to complete transaction.');
  });

  it('should return object when target, quantity and key arguments are passed in on function call', async () => {
    const key = JSON.parse(readFileSync('wallet2.json').toString());
    const txn = await createTransaction({ target: 'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY', quantity: '1000000', key: key });

    expect(txn).toMatchObject({
      id: '',
      owner: key.n,
      target: 'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY',
      quantity: '1000000',
      signature: '',
    });
  });

  it('should return object when useBundlr argument is passed in on function call', async () => {
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({
      data: '../__tests__/testAssets/jsonTest.json',
      key: key,
      options: { useBundlr: true }
    });

    expect(txn).toMatchObject({
      bundlr: { currency: 'arweave', address: '3pcfE9v2eRhtnHvBK95n4c2_XBzGbZuC_dwccW-BfO4' },
      signer: { jwk: key }
    });
  });

  it('should return object when tags are passed in on function call', async () => {
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({
      data: '../__tests__/testAssets/jsonTest.json',
      key: key,
      options: {
        tags: [{ 'name': 'some_name', value: 'some_value' }, { 'name': 'some_name_2', value: 'some_value_2' }]
      }
    });

    expect(txn).toMatchObject({
      id: '',
      owner: key.n,
      target: '',
      quantity: '0',
      signature: '',
    });
  });

  it('should return object when tags and useBundlr arguments are passed in on function call', async () => {
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({
      data: '../__tests__/testAssets/jsonTest.json',
      key: key,
      options: {
        useBundlr: true,
        tags: [{ 'name': 'some_name', value: 'some_value' }, { 'name': 'some_name_2', value: 'some_value_2' }]
      }
    });

    expect(txn).toMatchObject({
      bundlr: { currency: 'arweave', address: '3pcfE9v2eRhtnHvBK95n4c2_XBzGbZuC_dwccW-BfO4' },
      signer: { jwk: key }
    });
  });

  it('should return object when signAndPostTxn argument is passed in on function call', async () => {
    const key = JSON.parse(readFileSync('wallet2.json').toString());
    const txn = await createTransaction({
      data: '../__tests__/testAssets/jsonTest.json',
      key: key,
      options: {
        tags: [{ 'name': 'some_name', value: 'some_value' }, { 'name': 'some_name_2', value: 'some_value_2' }],
        signAndPostTxn: true
      }
    });

    expect(txn).toMatchObject({
      response: {
        status: 200,
        statusText: 'OK',
      },
      txn: {
        owner: key.n,
        target: '',
        quantity: '0',
      },
    });
  });

  it('should return object when signAndPostTxn and useBundlr arguments are passed in on function call', async () => {
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({
      data: '../__tests__/testAssets/jsonTest.json',
      key: key,
      options: {
        useBundlr: true,
        tags: [{ 'name': 'some_name', value: 'some_value' }, { 'name': 'some_name_2', value: 'some_value_2' }],
        signAndPostTxn: true
      }
    });

    expect(txn).toBeDefined();
  });
});
