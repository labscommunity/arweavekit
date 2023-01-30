import { defaultCacheOptions, WarpFactory } from 'warp-contracts';
import {
  CreateContractProps,
  CreateContractReturnProps,
  ReadContractProps,
  WriteContractProps,
} from '../../types/contract';
import { JWKInterface } from 'arweave/node/lib/wallet';

/**
 * create contract with warp
 * @params environment: 'local' | 'testnet' | 'mainnet'
 * @params contractData: ContractData (data type from 'warp-contracts)
 *            wallet: Arwallet | CustomSignature
 *            initState: string
 *            src: string | Buffer
 * @returns contract: ContractDeploy (data type from 'warp-contracts') | void
 *            contractTxId: string
 *            srcTxId: string
 * @returns result: object
 *            status: nummber
 *            statusText: string
 */

export async function createContract(
  params: CreateContractProps
): Promise<CreateContractReturnProps> {
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
        ? WarpFactory.forTestnet()
        : WarpFactory.forMainnet();

  let status: number = 400;
  let statusText: string = "UNSUCCESSFUL";

  if (params.environment == 'local' || params.environment == 'testnet') {
    await warp.testing.addFunds(params.contractData.wallet as JWKInterface)
      .catch(e => console.log('ERROR', e.message));
  }

  const contract = await warp.deploy({
    wallet: params.contractData.wallet,
    initState: params.contractData.initState,
    src: params.contractData.src,
    tags: [{ 'name': 'PermawebJS', 'value': '1.0.0' }],
  })

  if (contract && contract.contractTxId != '' && contract.srcTxId != '') {
    status = 200;
    statusText = "SUCCESSFUL";
  };

  return {
    contract, result: { status, statusText }
  };
}

/**
 * write to contract with warp
 * @params environment: 'local' | 'testnet' | 'mainnet'
 * @params contractTxId: string
 * @params wallet: ArWallet | CustomSignature (data types from 'warp-contracts')
 * @params options: {} 
 * @returns writeContract: WriteInteraction (data type from 'warp-contracts') | null
 * @returns state: object
 * @returns result: object
 *            status: nummber
 *            statusText: string
 */

export async function writeContract(params: WriteContractProps) {
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
        ? WarpFactory.forTestnet()
        : WarpFactory.forMainnet();

  let status: number = 400;
  let statusText: string = "UNSUCCESSFUL";

  const contract = warp.contract(params.contractTxId).connect(params.wallet);

  const writeContract = await contract.writeInteraction(params.options, { tags: [{ 'name': 'PermawebJS', 'value': '1.0.0' }] });

  const readState = await contract.readState();

  if (writeContract?.originalTxId != '') {
    status = 200;
    statusText = "SUCCESSFUL"
  };

  return { writeContract, state: readState.cachedValue.state, result: { status, statusText } };
}

/**
 * read from contract with warp
 * @params environment: 'local' | 'testnet' | 'mainnet'
 * @params contractTxId: string
 * @params wallet: ArWallet | CustomSignature (data types from 'warp-contracts')
 * @returns writeContract: WriteInteraction (data type from 'warp-contracts') | null
 * @returns readContract: SortKeyCacheResult (data type from 'warp-contracts')
 * @returns result: object
 *            status: nummber
 *            statusText: string
 */

export async function readContractState(params: ReadContractProps) {
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
        ? WarpFactory.forTestnet({ ...defaultCacheOptions, inMemory: true })
        : WarpFactory.forMainnet({ ...defaultCacheOptions, inMemory: true });

  let status: number = 400;
  let statusText: string = "UNSUCCESSFUL";

  const contract = warp.contract(params.contractTxId).connect(params.wallet);

  const readContract = await contract.readState();

  if (readContract.sortKey && readContract.cachedValue) {
    status = 200;
    statusText = "SUCCESSFUL"
  };

  return { readContract, result: { status, statusText } };
}
