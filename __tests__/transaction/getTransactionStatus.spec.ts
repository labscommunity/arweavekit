import { createTransaction, getTransactionStatus } from '../../src';
import { getWallet, getArweave } from './utils';

jest.setTimeout(300000);

describe('Get Transaction Status', () => {
  it('should get status of arweave transaction on local', async () => {
    const key = await getWallet('local');
    const arweave = await getArweave('local');

    const txn = await createTransaction({
      key: key,
      type: 'data',
      environment: 'local',
      data: 'data',
      options: {
        signAndPost: true,
      },
    });

    await arweave.api.get('mine');

    const getStatus = await getTransactionStatus({
      environment: 'local',
      transactionId: txn.transaction.id,
    });

    expect(getStatus).toBeDefined();
    expect(getStatus).toHaveProperty('status');
    expect(getStatus).toHaveProperty('confirmed');
    expect(getStatus.confirmed).toHaveProperty('block_height');
    expect(getStatus).toMatchObject({ status: 200 });
  });

  it('should get status of arweave transaction on mainnet', async () => {
    const getStatus = await getTransactionStatus({
      environment: 'mainnet',
      transactionId: 'gPRPfb9fQ4UVMr9zxosuNpqRyS2lRzu_rHrLnas6kh0',
    });

    expect(getStatus).toBeDefined();
    expect(getStatus).toHaveProperty('status');
    expect(getStatus).toHaveProperty('confirmed');
    expect(getStatus).toMatchObject({ status: 200 });
  });
});
