import { JWKInterface } from 'warp-contracts';
import {
  createContract,
  createWallet,
  viewContractState,
  writeContract,
} from '../../src/index';
import { readFileSync } from 'fs';

type ContractState = { counter: number };
const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');
const contractSrcEval = readFileSync(
  '__tests__/contract/data/contract-evaloptions.js',
  'utf-8'
);
const initStateEval = readFileSync(
  '__tests__/contract/data/state-evaloptions.json',
  'utf-8'
);

jest.setTimeout(120000);

describe('View Contract State', () => {
  let key: JWKInterface, walletAddress: string;

  beforeAll(async () => {
    ({ key, walletAddress } = await createWallet({
      environment: 'local',
    }));
  });

  it('should update contract creator and get creator on local', async () => {
    const { contractTxId } = await createContract({
      wallet: key,
      environment: 'local',
      initialState: initState,
      contractSource: contractSrc,
    });

    await writeContract({
      wallet: key,
      environment: 'local',
      contractTxId,
      options: {
        function: 'updateCreator',
      },
    });

    const { viewContract, result } = await viewContractState({
      wallet: key,
      environment: 'local',
      contractTxId,
      options: {
        function: 'getCreator',
      },
    });

    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
    expect(viewContract.result).toEqual(walletAddress);
  });

  it('should do internal write and view state on local', async () => {
    const evaluationOptions = {
      allowBigInt: true,
      internalWrites: true,
    };
    const { contractTxId: contractTxId1 } = await createContract({
      wallet: key,
      environment: 'local',
      initialState: initStateEval,
      contractSource: contractSrcEval,
    });

    const { contractTxId: contractTxId2 } = await createContract({
      wallet: key,
      environment: 'local',
      initialState: initStateEval,
      contractSource: contractSrcEval,
    });

    const { state } = await writeContract<ContractState>({
      wallet: key,
      environment: 'local',
      contractTxId: contractTxId1,
      options: {
        function: 'internalWrite',
        contractId: contractTxId2,
      },
      evaluationOptions,
    });

    const { viewContract, result } = await viewContractState({
      wallet: key,
      environment: 'local',
      contractTxId: contractTxId2,
      options: {
        function: 'counter',
      },
      evaluationOptions,
    });

    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
    expect(viewContract.result).toEqual(state.counter);
  });

  it('should update contract creator and get creator on testnet', async () => {
    const { contractTxId } = await createContract({
      wallet: key,
      environment: 'local',
      initialState: initState,
      contractSource: contractSrc,
    });

    await writeContract({
      wallet: key,
      environment: 'local',
      contractTxId,
      options: {
        function: 'updateCreator',
      },
    });

    const { viewContract, result } = await viewContractState({
      wallet: key,
      environment: 'local',
      contractTxId,
      options: {
        function: 'getCreator',
      },
    });

    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
    expect(viewContract.result).toEqual(walletAddress);
  });

  it('should get caller on local', async () => {
    const { contractTxId } = await createContract({
      wallet: key,
      environment: 'local',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { viewContract, result } = await viewContractState({
      wallet: key,
      environment: 'local',
      contractTxId,
      options: {
        function: 'getCaller',
      },
    });

    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
    expect(viewContract.result).toEqual(walletAddress);
  });

  it('should get error message when function not present on local', async () => {
    const { contractTxId } = await createContract({
      wallet: key,
      environment: 'local',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { viewContract, result } = await viewContractState({
      wallet: key,
      environment: 'local',
      contractTxId,
      options: { function: 'arweavekit' },
    });

    expect(result).toEqual({ status: 400, statusText: 'UNSUCCESSFUL' });
    expect(viewContract.errorMessage).toEqual('Function not found');
  });

  it('should not get caller when wallet key not passed on local', async () => {
    const { contractTxId } = await createContract({
      wallet: key,
      environment: 'local',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { viewContract, result } = await viewContractState({
      environment: 'local',
      contractTxId,
      options: {
        function: 'getCaller',
      },
    });

    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
    expect(viewContract.result).toEqual('');
  });

  it('should read balance of target from atomic cookies contract on mainnet', async () => {
    const { viewContract, result } = await viewContractState<
      any,
      { balance: number; target: string }
    >({
      environment: 'mainnet',
      contractTxId: 'rK2BjT9OOFTut82rNZxu_D5RjwoMJCNgnnq1X0Z4ly0',
      options: { function: 'balance', target: walletAddress },
      evaluationOptions: {
        remoteStateSyncEnabled: true,
        remoteStateSyncSource: 'https://dre-u.warp.cc/contract',
        unsafeClient: 'skip',
        internalWrites: true,
        allowBigInt: true,
      },
    });

    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
    expect(viewContract.result.target).toEqual(walletAddress);
    expect(viewContract.result.balance).toEqual(0);
  });
});
