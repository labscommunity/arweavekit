import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import * as Types from '../types/contract';
import { Othent as othent } from 'othent';

/**
 * Get a Warp instance based on the specified environment and options.
 * @param environment - The environment ('local', 'testnet', or 'mainnet').
 * @param useDeployPlugin - Whether to use the DeployPlugin (Default: false).
 * @param cacheOptions - Options for caching (defaults {@link defaultCacheOptions}).
 * @returns An instance of Warp.
 */
const getWarpInstance = (
  environment: 'local' | 'testnet' | 'mainnet',
  useDeployPlugin = false,
  cacheOptions = defaultCacheOptions
) => {
  const warp =
    environment === 'local'
      ? WarpFactory.forLocal()
      : environment === 'testnet'
      ? WarpFactory.forTestnet(cacheOptions)
      : WarpFactory.forMainnet(cacheOptions);

  if (useDeployPlugin) {
    warp.use(new DeployPlugin());
  }

  return warp;
};

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
  const warp = getWarpInstance(params.environment, true);

  if (params.environment === 'local') {
    await warp.testing
      .addFunds(params.wallet)
      .catch((e) => console.log('ERROR', e.message));
  }
  const wallet =
    params.environment === 'local'
      ? params.wallet
      : new ArweaveSigner(params.wallet);

  const { contractTxId } = await warp.deploy({
    wallet,
    initState: params.initialState,
    src: params.contractSource,
  });

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
  const warp = getWarpInstance(params.environment);

  let status: number = 400;
  let statusText: string = 'UNSUCCESSFUL';

  const signer = params.wallet || 'use_wallet';

  const contract = warp.contract(params.contractTxId).connect(signer);

  const writeContract = await contract.writeInteraction(params.options, {
    tags: [{ name: 'ArweaveKit', value: '1.4.9' }],
    disableBundling: signer === 'use_wallet',
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
  const warp = getWarpInstance(params.environment, false, {
    ...defaultCacheOptions,
    inMemory: true,
  });

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

  const response = await fetch(`${url}/contract?txId=${contractTxId}`, {
    method: 'GET',
  });

  const contract = await response.json();
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
