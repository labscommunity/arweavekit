import ArLocal from 'arlocal';
import Arweave from 'arweave/node/common';
import { createContract } from '../../src/index';
import { writeFileSync, readFileSync } from 'fs';

let arlocal: ArLocal, initState: string, contractSrc: string;
const port = 1986;
jest.setTimeout(120000);

beforeAll(async () => {
  arlocal = new ArLocal(port, false);
  await arlocal.start();

  const arweave = new Arweave({
    host: 'localhost',
    port,
    protocol: 'http',
  });

  const testWallet = await arweave.wallets.generate();

  writeFileSync('./testWallet.json', JSON.stringify(testWallet));
});

afterAll(async () => {
  arlocal.stop();
});

describe('Create Contract', () => {
  it('should create a new contract with no wallet passed in', async () => {
    const contractSrc = readFileSync(
      '__tests__/contract/data/contract.js',
      'utf-8'
    );
    const initState = readFileSync(
      '__tests__/contract/data/state.json',
      'utf-8'
    );

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
    const contractSrc = readFileSync(
      '__tests__/contract/data/contract.js',
      'utf-8'
    );
    const initState = readFileSync(
      '__tests__/contract/data/state.json',
      'utf-8'
    );
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
