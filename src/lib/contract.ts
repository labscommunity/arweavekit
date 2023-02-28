import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import { JWKInterface } from 'arweave/node/lib/wallet';
import * as Types from '../types/contract';

/***
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
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
      ? WarpFactory.forTestnet()
      : WarpFactory.forMainnet();

  if (params.environment === 'local' || params.environment === 'testnet') {
    await warp.testing
      .addFunds(params.wallet as JWKInterface)
      .catch((e) => console.log('ERROR', e.message));
  }
  const { contractTxId } = await warp.deploy({
    wallet: params.wallet,
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
    status: {
      code: status,
      message: statusText,
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

  const contract = warp.contract(params.contractTxId).connect(params.wallet);

  const writeContract = await contract.writeInteraction(params.options, {
    tags: [{ name: 'PermawebJS', value: '1.0.0' }],
  });

  const readState = await contract.readState();

  if (writeContract?.originalTxId != '') {
    status = 200;
    statusText = 'SUCCESSFUL';
  }

  return {
    writeContract,
    state: readState.cachedValue.state,
    status: {
      code: status,
      message: statusText,
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

  const contract = warp.contract(params.contractTxId).connect(params.wallet);

  const readContract = await contract.readState();

  if (readContract.sortKey && readContract.cachedValue) {
    status = 200;
    statusText = 'SUCCESSFUL';
  }

  return {
    readContract,
    status: {
      code: status,
      message: statusText,
    },
  };
}

/**
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
