import { readFileSync } from 'fs';
import { createContract, createWallet } from '../../src';
import crypto from 'crypto';
import { Tags } from 'warp-contracts';

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

describe('Create Contract', () => {
  it('should create a new contract with arweave wallet passed in on testnet', async () => {
    const { key } = await createWallet({
      environment: 'local',
    });

    const { contract, result } = await createContract({
      wallet: key,
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    expect(contract).toBeDefined();
    expect(contract).toHaveProperty('_contractTxId');
    expect(typeof contract).toEqual('object');
    expect(result).toBeDefined();
    expect(typeof result).toEqual('object');
    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
  });

  it('should create a new contract with arweave wallet passed in on testnet with a contract source txId', async () => {
    const { key } = await createWallet({
      environment: 'local',
    });

    const { contract, result } = await createContract({
      wallet: key,
      environment: 'testnet',
      initialState: initState,
      contractSource: 'o82FQI0q7YZRoP0snJyJji_ksQ14HQ0PV52wMY8LIyk',
    });

    expect(contract).toBeDefined();
    expect(contract).toHaveProperty('_contractTxId');
    expect(typeof contract).toEqual('object');
    expect(result).toBeDefined();
    expect(typeof result).toEqual('object');
    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
  });

  it('should create a new contract with arweave wallet passed in on testnet and data', async () => {
    const { key } = await createWallet({
      environment: 'local',
    });

    const { contract, result } = await createContract({
      wallet: key,
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
      data: {
        'Content-Type': 'text/plain',
        body: 'Hello World!',
      },
      tags: [{ name: 'App-Name', value: 'Testing' }] as Tags,
    });

    const helloWorld = await (
      await fetch(
        `https://gw.warp.cc/sonar/gateway/contract-data/${contract.txId()}`
      )
    ).text();

    expect(helloWorld).toBe('Hello World!');
    expect(contract).toBeDefined();
    expect(contract).toHaveProperty('_contractTxId');
    expect(typeof contract).toEqual('object');
    expect(result).toBeDefined();
    expect(typeof result).toEqual('object');
    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
  });

  it('should create a new contract with arweave wallet passed in on localhost', async () => {
    const { key } = await createWallet({ environment: 'local' });

    const { contract, result } = await createContract({
      environment: 'local',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    expect(contract).toBeDefined();
    expect(typeof contract).toEqual('object');
    expect(contract).toHaveProperty('_contractTxId');
    expect(result).toBeDefined();
    expect(typeof result).toEqual('object');
    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
  });

  it('should create a new contract with ethereum wallet passed in on testnet', async () => {
    const key = crypto.randomBytes(32).toString('hex');

    const { contract, result } = await createContract({
      environment: 'testnet',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    expect(contract).toBeDefined();
    expect(typeof contract).toEqual('object');
    expect(contract).toHaveProperty('_contractTxId');
    expect(result).toBeDefined();
    expect(typeof result).toEqual('object');
    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
  });

  it('should not create a new contract if wallet not passed on node environment', async () => {
    try {
      await createContract({
        environment: 'local',
        initialState: initState,
        contractSource: contractSrc,
      });

      // If the function doesn't throw an error, fail the test
      fail('Expected createContract to throw an error');
    } catch (error: any) {
      expect(error.message).toBe('[ArweaveKit] Failed to initialize signer');
    }
  });
});
