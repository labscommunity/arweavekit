import { getWallet } from './utils';
import { createTransaction, getData } from '../../src';

jest.setTimeout(300000);

describe('Get Data', () => {
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

    const getTxnData = await getData({
      environment: 'local',
      transactionId: txn.transaction.id,
    });
    console.log(getTxnData);

    expect(getTxnData).toBeDefined();
    expect(getTxnData).toBe('data');
  });

  it('should get arweave transaction on mainnet for Text', async () => {
    const getTxn = await getData({
      environment: 'mainnet',
      transactionId: 'U9KJecUGw39-BdF0YFPZk5n-PHM2A0r9HefJ2H8jZ78',
    });
    expect(getTxn).toBeDefined();
    expect(getTxn).toBe('hello');
  });

  it('should get arweave transaction on mainnet for JSON', async () => {
    const getTxn = await getData({
      environment: 'mainnet',
      transactionId: 'chGa5cCOQRwjiDOABYQseAPesN0-qdxBTozDpNhl2nc',
    });
    console.log(getTxn);
    expect(getTxn).toBeDefined();
  });

  it('should get arweave transaction on mainnet for PDF', async () => {
    const getTxn = await getData({
      environment: 'mainnet',
      transactionId: 'N9miiLuCGzSst_ABLohAQbZGC_uG5h9raTfp3LLNAZg',
    });
    expect(getTxn).toBeDefined();
  });
  it('should get arweave transaction on mainnet for Image', async () => {
    const getTxn = await getData({
      environment: 'mainnet',
      transactionId: 'vevXEz2AMl2ZMG6xCOwN0rO18tEqSezURVE-IkU38Ec',
    });
    expect(getTxn).toBeDefined();
  });
});
