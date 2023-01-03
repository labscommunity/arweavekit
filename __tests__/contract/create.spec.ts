import { createContract } from '../../src/index';
import { configTests } from '../../src/utils';
import { readFileSync } from 'fs';

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

configTests();

describe('Create Contract', () => {
  it('should read initial state', async () => {
    const { contract, contractTxId } = await createContract({
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    expect(contract).toBeDefined();
    expect(contractTxId).toBeDefined();
    expect(typeof contractTxId).toBe('string');
  });

  it('should create a new contract with wallet passed in', async () => {
    // SUPER IMPORTANT TO PARSE - MENTION IN DOCS
    const wallet = JSON.parse(readFileSync('testWallet.json', 'utf-8'));

    const { contract, contractTxId } = await createContract({
      wallet,
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    expect(contract).toBeDefined();
    expect(contractTxId).toBeDefined();
    expect(typeof contractTxId).toBe('string');
  });
});
