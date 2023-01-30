import {
  createContract,
  writeContract,
  readContractState,
  createWallet,
} from '../../src/index';
import { readFileSync } from 'fs';
import ArLocal from 'arlocal';

// Please note that wallet1.json is an empty pre-created wallet stored in the root dir (not pushed to github)
// Please note that wallet2.json is a pre-funded pre-created wallet stored in the root dir (not pushed to github)

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

const port = 1984;
const arlocal = new ArLocal(port, false);

describe('Write Contracts', () => {
  it('should create and write to contract on local', async () => {
    const port = 1984;
    const arlocal = new ArLocal(port, false);

    await arlocal.start();
    const { key } = await createWallet({ environment: 'local' });

    const { contract } = await createContract({
      environment: 'local',
      contractData: {
        wallet: key,
        initState: initState,
        src: contractSrc,
      }
    });

    await writeContract({
      environment: 'local',
      contractTxId: contract.contractTxId,
      wallet: key,
      options: {
        function: 'initialize',
      },
    });

    await writeContract({
      environment: 'local',
      contractTxId: contract.contractTxId,
      wallet: key,
      options: {
        function: 'fifty',
      },
    });

    const { readContract } = await readContractState({
      environment: 'local',
      contractTxId: contract.contractTxId,
      wallet: key,
    });

    expect(readContract.sortKey).toBeDefined();
    expect(readContract.cachedValue.state).toBeDefined();
    expect(readContract.cachedValue.validity).toBeDefined();
    expect(typeof readContract.cachedValue.state).toBe('object');
    expect(typeof readContract.cachedValue.validity).toBe('object');
    expect(readContract.cachedValue.state).toEqual({ counter: 50 });

    arlocal.stop();
  });

  it('should create, write to and rewrite on contract on local', async () => {
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
