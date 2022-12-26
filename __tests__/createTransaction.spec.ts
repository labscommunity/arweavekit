import { createTransaction } from "../src/common/transaction";

describe('Create Transaction', () => {
  it('Should stringify the data and create a data transaction using arweaveJS for a PNG file'), async () => {
    const txn = await createTransaction({ data: '../__tests__/testAssets/imgTest.png' });

    expect(txn)
  };
})