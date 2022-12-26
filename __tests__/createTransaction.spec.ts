import { createTransaction } from "../src/common/transaction";
import { readFileSync } from 'fs';

describe('Create Transaction', () => {
  it('should return string asking to call function with valid arguments', async () => {
    // const key = JSON.parse(readFileSync('wallet1.json').toString());
    // console.log("key: ", key);
    // const txn = await createTransaction({ data: '../__tests__/testAssets/imgTest.png', key: key });

    // console.log("txn: ", txn);
    // expect(typeof txn).toEqual("object");
    // const txn = await createTransaction({ data: '../__tests__/testAssets/imgTest.png' });
    const txn = await createTransaction({});
    console.log("txn: ", txn);
  });

  it('should return empty string for owner key in transaction object when no key argument is passed in on fucntion call', async () => { });

  it('should return ___ when both data and key arguments are passed in on function call', async () => { });

  it('should return ___ when target argument is passed in on function call', async () => { });

  it('should return ___ when quantity argument is passed in on function call', async () => { });

  it('should return ___ when target and quantity, but no key arguments are passed in on function call', async () => { });

  it('should return ___ when target, quantity and key arguments are passed in on function call', async () => { });

  it('should return ___ when useBundlr argument is passed in on function call', async () => { });

  it('should return ___ when signAndPostTxn argument is passed in on function call', async () => { });
})