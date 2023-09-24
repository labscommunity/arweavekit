import { createTransaction, getTransaction } from '../../src';
import { getWallet } from './utils';

jest.setTimeout(300000);

describe('Get Transaction', () => {
  it('should get arweave transaction on local', async () => {
    const key = await getWallet('local');

    const txn = await createTransaction({
      key: key,
      type: 'data',
      environment: 'local',
      data: 'data',
      options: {
        signAndPost: true,
      },
    });

    const getTxn = await getTransaction({
      environment: 'local',
      transactionId: txn.transaction.id,
    });

    expect(getTxn).toBeDefined();
    expect(getTxn.id).toBeDefined();
    expect(getTxn.signature).toBeDefined();
  });

  it('should get arweave transaction on mainnet', async () => {
    const getTxn = await getTransaction({
      environment: 'mainnet',
      transactionId: 'gPRPfb9fQ4UVMr9zxosuNpqRyS2lRzu_rHrLnas6kh0',
    });

    expect(getTxn).toBeDefined();
    expect(getTxn.id).toBeDefined();
    expect(getTxn.signature).toBeDefined();
  });
});
