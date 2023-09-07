import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import * as Types from '../types/contract';
import { Othent as othent } from 'othent';

/***
 * create warp contract
 * @params CreateContractProps
 * @returns CreateContractReturnProps
 */
export async function createContract(
  params: Types.CreateContractProps
): Promise<Types.CreateContractReturnProps> {
  let status: number = 400;
  let statusText: string = 'UNSUCCESSFUL';
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal().use(new DeployPlugin())
      : params.environment === 'testnet'
      ? WarpFactory.forTestnet().use(new DeployPlugin())
      : WarpFactory.forMainnet().use(new DeployPlugin());

  if (params.environment === 'local') {
    await warp.testing
      .addFunds(params.wallet)
      .catch((e) => console.log('ERROR', e.message));
  }
  let contractTxId = '';
  if (params.environment === 'local') {
    const { contractTxId: deployedContractTxId } = await warp.deploy({
      wallet: params.wallet,
      initState: params.initialState,
      src: params.contractSource,
    });
    contractTxId = deployedContractTxId;
  } else {
    const { contractTxId: deployedContractTxId } = await warp.deploy({
      wallet: new ArweaveSigner(params.wallet),
      initState: params.initialState,
      src: params.contractSource,
    });
    contractTxId = deployedContractTxId;
  }
  const contract = warp.contract(contractTxId).connect(params.wallet);

  if (contractTxId !== '') {
    status = 200;
    statusText = 'SUCCESSFUL';
  }

  return {
    contract,
    contractTxId,
    result: {
      status,
      statusText,
    },
  };
}

/**
 * write to warp contract
 * @params WriteContractProps
 */

export async function writeContract(params: Types.WriteContractProps) {
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
      ? WarpFactory.forTestnet()
      : WarpFactory.forMainnet();

  let status: number = 400;
  let statusText: string = 'UNSUCCESSFUL';

  const contract = warp
    .contract(params.contractTxId)
    .connect(params.wallet ? params.wallet : 'use_wallet');

  const writeContract = await contract.writeInteraction(params.options, {
    tags: [{ name: 'ArweaveKit', value: '1.4.9' }],
  });

  const readState = await contract.readState();

  if (writeContract?.originalTxId != '') {
    status = 200;
    statusText = 'SUCCESSFUL';
  }

  return {
    writeContract,
    state: readState.cachedValue.state,
    result: {
      status,
      statusText,
    },
  };
}

/**
 * read state of warp contract
 * @params ReadContractProps
 */

export async function readContractState(params: Types.ReadContractProps) {
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
      ? WarpFactory.forTestnet({ ...defaultCacheOptions, inMemory: true })
      : WarpFactory.forMainnet({ ...defaultCacheOptions, inMemory: true });

  let status: number = 400;
  let statusText: string = 'UNSUCCESSFUL';

  const contract = warp.contract(params.contractTxId);

  const readContract = await contract.readState();

  if (readContract.sortKey && readContract.cachedValue) {
    status = 200;
    statusText = 'SUCCESSFUL';
  }

  return {
    readContract,
    result: {
      status,
      statusText,
    },
  };
}

/**
 * get contract
 * @params contractTxId: string
 * @returns Contract
 */
export async function getContract(contractTxId: string) {
  const url = 'https://gateway.warp.cc/gateway';

  const getContract = await fetch(`${url}/contract?txId=${contractTxId}`, {
    method: 'GET',
  });

  const contract = await getContract.json();
  return { contract };
}

/**
 * writeContractWOthent
 * @params WriteContractWOthentProps
 * @returns WriteContractWOthentReturnProps
 */

export async function writeContractWOthent(
  params: Types.WriteContractWOthentProps
): Promise<Types.WriteContractWOthentReturnProps> {
  const othentInstance = await othent({
    API_ID: params.apiId,
  });
  const signedTransaction = await othentInstance.signTransactionWarp({
    othentFunction: params.othentFunction,
    data: params.data,
    tags: [{ name: 'ArweaveKit', value: '1.4.9' }],
  });

  const postedTransaction = await othentInstance.sendTransactionWarp(
    signedTransaction
  );

  if (postedTransaction.success) {
    return postedTransaction as Types.WriteContractWOthentReturnProps;
  } else {
    throw new Error('Transaction creation unsuccessful.');
  }
}

/**
 * readContractWOthent
 * @params ReadContractWOthentProps
 * @returns ReadContractWOthentReturnProps
 */

export async function readContractWOthent(
  params: Types.ReadContractWOthentProps
): Promise<Types.ReadContractWOthentReturnProps> {
  const othentInstance = await othent({
    API_ID: params.apiId,
  });
  const res = await othentInstance.readCustomContract({
    contract_id: params.contractTxId,
  });

  return res;
}



export const ArweaveKit = {
  createContract,
  writeContract,
  readContractState,
  getContract,
  writeContractWOthent,
  readContractWOthent,

  use(externalPackage: any) {
    const combined = {
      ...this,
      ...externalPackage
    };
    combined.use = this.use.bind(combined);
    return combined;
  }
};
