import {
  createContract,
  writeContract,
  readContractState,
  createWallet,
} from '../../src';
import { readFileSync } from 'fs';
import crypto from 'crypto';
import { Tags } from 'warp-contracts';

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

describe('Write Contracts', () => {
  it('should create and write to contract on local', async () => {
    const { key } = await createWallet({ environment: 'local' });

    const { contractTxId } = await createContract({
      environment: 'local',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    await writeContract({
      environment: 'local',
      contractTxId: contractTxId,
      wallet: key,
      options: {
        function: 'initialize',
      },
    });

    await writeContract({
      environment: 'local',
      contractTxId: contractTxId,
      wallet: key,
      options: {
        function: 'fifty',
      },
    });

    const { readContract } = await readContractState({
      environment: 'local',
      contractTxId: contractTxId,
    });

    expect(readContract.sortKey).toBeDefined();
    expect(readContract.cachedValue.state).toBeDefined();
    expect(readContract.cachedValue.validity).toBeDefined();
    expect(typeof readContract.cachedValue.state).toBe('object');
    expect(typeof readContract.cachedValue.validity).toBe('object');
    expect(readContract.cachedValue.state).toEqual({ counter: 50 });
  });

  it('should create and not write to contract if wallet not passed on node local', async () => {
    const { key } = await createWallet({ environment: 'local' });

    const { contractTxId } = await createContract({
      environment: 'local',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    try {
      await writeContract({
        environment: 'local',
        contractTxId,
        options: {
          function: 'initialize',
        },
      });

      // If the function doesn't throw an error, fail the test
      fail('Expected writeContract to throw an error');
    } catch (error: any) {
      expect(error.message).toBe('[ArweaveKit] Failed to initialize signer');
    }
  });

  it('should create, write to and rewrite on contract on testnet', async () => {
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
      tags: [{ name: 'App-Name', value: 'Testing' }] as Tags,
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

  it('should create, write to and rewrite on contract on testnet with ethereum', async () => {
    const key = crypto.randomBytes(32).toString('hex');

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
});
