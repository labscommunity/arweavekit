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

  it('should create a new contract with wallet passed in', async () => {
    // SUPER IMPORTANT TO PARSE - MENTION IN DOCS
    const wallet2 = JSON.parse(readFileSync('wallet2.json', 'utf-8'));

    const contract = await createContract({
      environment: 'mainnet',
      contractData: {
        wallet: wallet2,
        initState: initState,
        src: contractSrc,
      }
    });

    console.log("===================New contract deploy return test===================", contract);
  });
});
