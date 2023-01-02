import { exec } from 'child_process';
import ArLocal from 'arlocal';
import {
  createContract,
  writeContract,
  createWallet,
  readContract,
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

describe('Write Contracts', () => {
  it('should create and write to contract', async () => {
    const environment = 'testnet';

    const { contract: cntrct, contractTxId } = await createContract({
      environment,
      initialState: initState,
      contractSource: contractSrc,
    });

    const { contract } = await writeContract({
      contract: cntrct,
      options: {
        function: 'initialize',
      },
    });

    const { cachedValue } = await readContract({
      contract,
    });

    expect(cachedValue.state).toBeDefined();
    expect(cachedValue.validity).toBeDefined();
    expect(typeof contractTxId).toBe('string');
    expect(typeof cachedValue.state).toBe('object');
    expect(typeof cachedValue.validity).toBe('object');
  });

  it('should update contract', async () => {
    const environment = 'testnet';

    const { contract: cntrct, contractTxId } = await createContract({
      environment,
      initialState: initState,
      contractSource: contractSrc,
    });

    const { contract } = await writeContract({
      contract: cntrct,
      options: {
        function: 'fifty',
      },
    });

    const { cachedValue } = await readContract({
      contract,
    });

    expect(cachedValue.state).toBeDefined();
    expect(cachedValue.validity).toBeDefined();
    expect(typeof contractTxId).toBe('string');
    expect(typeof cachedValue.state).toBe('object');
    expect(typeof cachedValue.validity).toBe('object');
  });
});
