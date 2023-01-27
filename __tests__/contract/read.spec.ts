import {
  createContract,
  createWallet,
  readContractState,
  writeContract,
} from '../../src/index';
import { readFileSync } from 'fs';

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

describe('Read Contract State', () => {
  it('should read initial state', async () => {
    const { key: wallet } = await createWallet({ environment: 'local' });

    const { contract } = await createContract({
      environment: 'testnet',
      contractData: {
        wallet: wallet,
        initState: initState,
        src: contractSrc,
      }
    });

    const { readContract } = await readContractState({
      environment: 'testnet',
      contractTxId: contract.contractTxId,
      wallet: wallet,
    });

    console.log("This is readContract from test", readContract);

    expect(readContract.sortKey).toBeDefined();
    expect(readContract.cachedValue.state).toBeDefined();
    expect(readContract.cachedValue.validity).toBeDefined();
    expect(typeof readContract.cachedValue.state).toBe('object');
    expect(typeof readContract.cachedValue.validity).toBe('object');
    expect(readContract.cachedValue.state).toEqual({ counter: 0 });
  });

  it('should read updated state', async () => {
    const { key: wallet } = await createWallet({ environment: 'local' });

    const { contract } = await createContract({
      environment: 'testnet',
      contractData: {
        wallet: wallet,
        initState: initState,
        src: contractSrc,
      }
    });

    await writeContract({
      environment: 'testnet',
      contractTxId: contract.contractTxId,
      wallet: wallet,
      options: {
        function: 'fifty',
      },
    });

    const { readContract } = await readContractState({
      environment: 'testnet',
      contractTxId: contract.contractTxId,
      wallet: wallet,
    });

    console.log("This is readContract from test", readContract);

    expect(readContract.sortKey).toBeDefined();
    expect(readContract.cachedValue.state).toBeDefined();
    expect(readContract.cachedValue.validity).toBeDefined();
    expect(typeof readContract.cachedValue.state).toBe('object');
    expect(typeof readContract.cachedValue.validity).toBe('object');
    expect(readContract.cachedValue.state).toEqual({ counter: 50 });
  });
});
