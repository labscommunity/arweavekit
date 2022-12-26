import { createTransaction } from "../src/common/transaction";
import { readFileSync } from 'fs';

describe('Create Transaction', () => {
  it('should stringify the data and create a data transaction using arweaveJS for a PNG file', async () => {
    // const key = JSON.parse(readFileSync('wallet1.json').toString());
    // console.log("key: ", key);
    // const txn = await createTransaction({ data: '../__tests__/testAssets/imgTest.png', key: key });

    // console.log("txn: ", txn);
    // expect(typeof txn).toEqual("object");
    const txn = await createTransaction({ data: '../__tests__/testAssets/imgTest.png' });
    console.log("txn: ", txn);
  });
})