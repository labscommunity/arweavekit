const { getTransactionStatus } = require('../src/index');

describe('Transaction Status', () => {
  it('should get the status of a transaction', async () => {
    // todo - create transaction

    // get status
    let txStatus;

    expect(txStatus.status).toBe(200);
    expect(txStatus.confirmed).toBeDefined();
    expect(txStatus.confirmed.number_of_confirmations).toBe(20);
  });
});
