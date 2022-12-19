const { getTransactionData } = require('../src/index');

describe('Transaction Data', () => {
  it('should get transaction data without tags', async () => {
    // todo - create transaction

    // get transaction data
    let txData = getTransactionData('', { tags: false });

    expect(txData).toBeDefined();
    expect(txData.id).toBeDefined();
  });

  it('should get transaction data with tags', async () => {
    // todo - create transaction

    // todo - add tags

    // get transaction data
    let txData = getTransactionData('', { tags: true });

    expect(txData).toBeDefined();
    expect(txData.id).toBeDefined();
    expect(txData.tags).toBeDefined();

    // todo check for tags
  });
});
