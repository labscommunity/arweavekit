import ArLocal from 'arlocal';
import { exec } from 'child_process';
import { createContract, createWallet } from '../../src/index';
import { writeFileSync, readFileSync } from 'fs';

const port = 1986;
const arlocal = new ArLocal(port, false);
const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');
jest.setTimeout(120000);

beforeAll(async () => {
  exec('yarn arlocal:run', (err) => {
    if (err) {
      console.error(err);
    }
  });

  await arlocal.start();

  const testWallet = await createWallet({ seedPhrase: false });

  writeFileSync('./testWallet.json', JSON.stringify(testWallet.key));
});

afterAll(async () => {
  arlocal.stop();
  exec('killall node', (err) => {
    if (err) {
      console.error(err);
    }
  });
});

describe('Create Contract', () => {
  it('should create a new contract with no wallet passed in', async () => {
    const contractLocal = await createContract({
      environment: 'local',
      initialState: initState,
      contractSource: contractSrc,
    });

    expect(contractLocal.wallet).toBeDefined();
    expect(contractLocal.contract).toBeDefined();
    expect(contractLocal.contractTxId).toBeDefined();
    expect(typeof contractLocal.contractTxId).toBe('string');
  });

  it('should create a new contract with wallet passed in', async () => {
    // SUPER IMPORTANT TO PARSE - MENTION IN DOCS
    const wallet = JSON.parse(readFileSync('testWallet.json', 'utf-8'));

    const contractLocal = await createContract({
      environment: 'testnet',
      wallet,
      initialState: initState,
      contractSource: contractSrc,
    });

    expect(contractLocal.contract).toBeDefined();
    expect(contractLocal.contractTxId).toBeDefined();
    expect(typeof contractLocal.contractTxId).toBe('string');
  });
});
