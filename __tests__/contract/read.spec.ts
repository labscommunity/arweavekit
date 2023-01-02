import {
  createContract,
  readContractState,
  writeContract,
} from '../../src/index';
import { configTests } from '../../src/utils';
import { readFileSync } from 'fs';

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

configTests();

describe('Read Contract State', () => {
  it('should read initial state', async () => {
    const { contract, contractTxId } = await createContract({
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { cachedValue, sortKey } = await readContractState({
      contract,
    });

    expect(JSON.stringify(cachedValue.state)).toBe('{"counter":0}');
    expect(sortKey).toBeDefined();
    expect(cachedValue.state).toBeDefined();
    expect(cachedValue.validity).toBeDefined();
    expect(typeof contractTxId).toBe('string');
    expect(typeof cachedValue.state).toBe('object');
    expect(typeof cachedValue.validity).toBe('object');
  });

  it('should read updated state', async () => {
    const { contract, contractTxId } = await createContract({
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { contract: writeCntrct } = await writeContract({
      contract,
      options: {
        function: 'fifty',
      },
    });

    const { cachedValue, sortKey } = await readContractState({
      contract: writeCntrct,
    });

    expect(sortKey).toBeDefined();
    expect(cachedValue.state).toBeDefined();
    expect(cachedValue.validity).toBeDefined();
    expect(typeof contractTxId).toBe('string');
    expect(typeof cachedValue.state).toBe('object');
    expect(typeof cachedValue.validity).toBe('object');
  });
});
