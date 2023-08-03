import { getTransaction } from '../../src';

jest.setTimeout(300000);

describe('Create Transaction', () => {
  it('should get arweave transaction', async () => {
    const getTxn = await getTransaction({
      environment: 'mainnet',
      transactionId: 'gPRPfb9fQ4UVMr9zxosuNpqRyS2lRzu_rHrLnas6kh0',
      options: {
        data: true,
        tags: true,
      },
    });

    console.log(getTxn);
    expect(getTxn).toBeDefined();
    expect(getTxn.id).toBeDefined();
    expect(getTxn.signature).toBeDefined();
  });
});
