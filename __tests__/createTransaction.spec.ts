import { createTransaction } from "../src/common/transaction";
import { readFileSync } from 'fs';

describe('Create Transaction', () => {
  jest.setTimeout(300000);

  it('should return string asking to call function with valid arguments', async () => {
    const txn = await createTransaction({});

    expect(txn).toEqual('Pass in valid data or token quantity and target to create a transaction.')
  });

  it('should return empty string for owner key in transaction object when no key argument is passed in on fucntion call', async () => {
    const txn = await createTransaction({ data: '../__tests__/testAssets/imgTest.png' });

    expect(txn).toMatchObject({ owner: '' });
  });

  it('should return part of owner key in transaction object when both data and key arguments are passed in on function call', async () => {
    const key = JSON.parse(readFileSync('wallet1.json').toString());
    const txn = await createTransaction({ data: '../__tests__/testAssets/imgTest.png', key: key });

    expect(txn).toMatchObject({ owner: key.n });
  });

  it('should return tring asking to call function with valid arguments when target argument is passed in on function call', async () => {
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
      owner: key.n,
      target: 'fiIvi9c6Oat86wvWuYMPU1ssSxLRDr2zOUiTV-asxmY',
      quantity: '1000000'
    });
  });

  it('should return ___ when useBundlr argument is passed in on function call', async () => { });

  it('should return ___ when signAndPostTxn argument is passed in on function call', async () => { });
});
