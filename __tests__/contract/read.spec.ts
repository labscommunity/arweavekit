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
    const { key } = await createWallet({ environment: 'local' });

    const { contractTxId } = await createContract({
      wallet: key,
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { readContract } = await readContractState({
      environment: 'testnet',
      contractTxId,
    });

    expect(readContract.sortKey).toBeDefined();
    expect(readContract.cachedValue.state).toBeDefined();
    expect(readContract.cachedValue.validity).toBeDefined();
    expect(typeof readContract.cachedValue.state).toBe('object');
    expect(typeof readContract.cachedValue.validity).toBe('object');
    expect(readContract.cachedValue.state).toEqual({ counter: 0 });

    console.log('Res', readContract);
  });
});

it('should read updated state', async () => {
  const { key } = await createWallet({ environment: 'local' });

  const { contractTxId } = await createContract({
    environment: 'testnet',
    wallet: key,
    initialState: initState,
    contractSource: contractSrc,
  });

  await writeContract({
    environment: 'testnet',
    contractTxId: contractTxId,
    wallet: key,
    options: {
      function: 'fifty',
    },
  });

  const { readContract } = await readContractState({
    environment: 'testnet',
    contractTxId: contractTxId,
  });

  expect(readContract.sortKey).toBeDefined();
  expect(readContract.cachedValue.state).toBeDefined();
  expect(readContract.cachedValue.validity).toBeDefined();
  expect(typeof readContract.cachedValue.state).toBe('object');
  expect(typeof readContract.cachedValue.validity).toBe('object');
  expect(readContract.cachedValue.state).toEqual({ counter: 50 });
});
