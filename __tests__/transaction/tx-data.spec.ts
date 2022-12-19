const { getTransactionData } = require('../src/index');

describe('Transaction Data', () => {
  it('should get transaction', async () => {
    // todo - create transaction
    // get transaction
  });

  it('should get transaction data only', async () => {
    // todo - create transaction

    // get transaction data
    let txData = getTransactionData('', { data: true });

    expect(txData).toBeDefined();
    expect(txData.id).toBeDefined();
    expect(txData.tags).toBeDefined();
  });

  it('should get transaction and tags', async () => {
    // todo - create transaction
    // todo - add tags
    // todo - get transaction and tags
  });

  it('should get transaction data and tags', async () => {
    // todo - create transaction
    // todo - add tags
    // todo - get transaction data and tags
  });
});
