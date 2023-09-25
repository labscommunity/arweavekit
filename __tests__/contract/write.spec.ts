import {
  createContract,
  writeContract,
  readContractState,
  createWallet,
} from '../../src';
import { readFileSync } from 'fs';
import crypto from 'crypto';
import { JWKInterface, Tags } from 'warp-contracts';

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const contractSrcBigInt = readFileSync(
  '__tests__/contract/data/contract-bigint.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

describe('Write Contracts', () => {
  let key: JWKInterface;

  beforeAll(async () => {
    ({ key } = await createWallet({
      environment: 'local',
    }));
  });

  it('should create and write to contract on local', async () => {
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

  it('should create and write to contract on local bigint', async () => {
    const evaluationOptions = { allowBigInt: true };
    const { contractTxId } = await createContract({
      environment: 'local',
      wallet: key,
      initialState: initState,
      contractSource: contractSrcBigInt,
    });

    await writeContract({
      environment: 'local',
      contractTxId: contractTxId,
      wallet: key,
      options: {
        function: 'initialize',
      },
      evaluationOptions,
    });

    const { readContract } = await readContractState({
      environment: 'local',
      contractTxId: contractTxId,
      evaluationOptions,
    });

    expect(readContract.sortKey).toBeDefined();
    expect(readContract.cachedValue.state).toBeDefined();
    expect(readContract.cachedValue.validity).toBeDefined();
    expect(typeof readContract.cachedValue.state).toBe('object');
    expect(typeof readContract.cachedValue.validity).toBe('object');
    expect(readContract.cachedValue.state).toEqual({ counter: BigInt(10) });
  });

  it('should create and write to contract on testnet with vrf', async () => {
    const { contractTxId } = await createContract({
      environment: 'testnet',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    const writeResult = await writeContract({
      environment: 'testnet',
      contractTxId: contractTxId,
      wallet: key,
      options: {
        function: 'random',
      },
      vrf: true,
    });

    expect(writeResult.state).toBeDefined();
    expect(typeof writeResult.state).toBe('object');
    expect(writeResult.state).toHaveProperty('counter');
    expect((writeResult.state as any).counter).toBeGreaterThanOrEqual(1);
    expect((writeResult.state as any).counter).toBeLessThanOrEqual(100);
  });

  it('should create and not write to contract if wallet not passed on node local', async () => {
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
      throw new Error('Expected writeContract to throw an error');
    } catch (error: any) {
      expect(error.message).toBe('[ArweaveKit] Failed to initialize signer.');
    }
  });

  it('should create and not write to contract with use_wallet passed in node environment', async () => {
    const { contractTxId } = await createContract({
      environment: 'local',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    try {
      await writeContract({
        wallet: 'use_wallet',
        environment: 'local',
        contractTxId,
        options: {
          function: 'initialize',
        },
      });
      // If the function doesn't throw an error, fail the test
      throw new Error('Expected writeContract to throw an error');
    } catch (error: any) {
      expect(error.message).toBe('[ArweaveKit] Failed to initialize signer.');
    }
  });

  it('should create and not write to contract with invalid wallet passed in node environment', async () => {
    const { contractTxId } = await createContract({
      environment: 'local',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    try {
      await writeContract({
        wallet: 'invalid',
        environment: 'local',
        contractTxId,
        options: {
          function: 'initialize',
        },
      });
      // If the function doesn't throw an error, fail the test
      throw new Error('Expected writeContract to throw an error');
    } catch (error: any) {
      expect(error.message).toBe('[ArweaveKit] Failed to initialize signer.');
    }
  });

  it('should create, write to and read a contract on testnet', async () => {
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

  it('should create, write to and read a contract on testnet with ethereum', async () => {
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

  it('should fail to write a contract on local with ethereum', async () => {
    const { contractTxId } = await createContract({
      environment: 'local',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    try {
      await writeContract({
        environment: 'local',
        contractTxId: contractTxId,
        wallet: crypto.randomBytes(32).toString('hex'),
        options: {
          function: 'fifty',
        },
      });
    } catch (error: any) {
      expect(error.message).toBe(
        'Unable to use signing function of type: ethereum when bundling is disabled.'
      );
    }
  });
});
