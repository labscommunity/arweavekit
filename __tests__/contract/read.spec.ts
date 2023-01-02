import { exec } from 'child_process';
import ArLocal from 'arlocal';
import {
  createWallet,
  createContract,
  readContract,
  writeContract,
} from '../../src/index';
import { writeFileSync, readFileSync } from 'fs';

let arlocal: ArLocal;
const port = 1986;
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

  arlocal = new ArLocal(port, false);
  await arlocal.start();

  const testWallet = await createWallet({ seedPhrase: false });

  writeFileSync('./testWallet.json', JSON.stringify(testWallet));
});

afterAll(async () => {
  arlocal.stop();
  exec('killall node', (err) => {
    if (err) {
      console.error(err);
    }
  });
});

describe('Read Contract State', () => {
  it('should read initial state', async () => {
    const { contract, contractTxId } = await createContract({
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { cachedValue, sortKey } = await readContract({
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

    const { cachedValue, sortKey } = await readContract({
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
