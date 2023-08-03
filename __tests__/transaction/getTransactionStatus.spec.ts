import { getTransactionStatus } from '../../src';

jest.setTimeout(300000);

describe('Create Transaction', () => {
  it('should get status of  arweave transaction', async () => {
    const getStatus = await getTransactionStatus({
      environment: 'mainnet',
      transactionId: 'gPRPfb9fQ4UVMr9zxosuNpqRyS2lRzu_rHrLnas6kh0',
    });

    expect(getStatus).toBeDefined();
    expect(getStatus).toHaveProperty('status');
    expect(getStatus).toHaveProperty('confirmed');
    expect(getStatus).toMatchObject({
      status: 200,
    });
  });
});
