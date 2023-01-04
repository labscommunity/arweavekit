import {
  createContract,
  writeContract,
  readContractState,
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

describe('Write Contracts', () => {
  it('should create and write to contract', async () => {
    const { contract: cntrct, contractTxId } = await createContract({
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { contract } = await writeContract({
      contract: cntrct,
      options: {
        function: 'initialize',
      },
    });

    const { cachedValue, sortKey } = await readContractState({
      contract,
    });

    expect(sortKey).toBeDefined();
    expect(cachedValue.state).toBeDefined();
    expect(cachedValue.validity).toBeDefined();
    expect(typeof contractTxId).toBe('string');
    expect(typeof cachedValue.state).toBe('object');
    expect(typeof cachedValue.validity).toBe('object');
  });

  it('should update contract', async () => {
    const { contract: cntrct, contractTxId } = await createContract({
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { contract } = await writeContract({
      contract: cntrct,
      options: {
        function: 'fifty',
      },
    });

    const { cachedValue, sortKey } = await readContractState({
      contract,
    });

    expect(sortKey).toBeDefined();
    expect(cachedValue.state).toBeDefined();
    expect(cachedValue.validity).toBeDefined();
    expect(typeof contractTxId).toBe('string');
    expect(typeof cachedValue.state).toBe('object');
    expect(typeof cachedValue.validity).toBe('object');
  });
});
