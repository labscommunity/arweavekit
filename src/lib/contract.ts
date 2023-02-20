import { WarpFactory } from 'warp-contracts';
import {
  CreateContractProps,
  CreateContractReturnProps,
} from '../types/contract';
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
  let statusText: string = 'UNSUCCESSFUL';

  if (params.environment == 'local' || params.environment == 'testnet') {
    await warp.testing
      .addFunds(params.contractData.wallet as JWKInterface)
      .catch((e) => console.log('ERROR', e.message));
  }

  const contract = await warp.deploy({
    wallet: params.contractData.wallet,
    initState: params.contractData.initState,
    src: params.contractData.src,
    tags: [{ name: 'PermawebJS', value: '1.0.0' }],
  });

  if (contract && contract.contractTxId != '' && contract.srcTxId != '') {
    status = 200;
    statusText = 'SUCCESSFUL';
  }

  return {
    contract,
    result: { status, statusText },
  };
}

export function creatoContracto() {
  return 'We are good to go';
}
