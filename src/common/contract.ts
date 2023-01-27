import { WarpFactory } from 'warp-contracts';
import {
  CreateContractProps,
  CreateContractReturnProps,
  ReadContractProps,
  WriteContractProps,
} from '../../types/contract';
import { writeFileSync, readFileSync } from 'fs';
import { getAddress, getBalance } from './wallet';
import { JWKInterface } from 'arweave/node/lib/wallet';

export async function createContract(
  params: CreateContractProps
): Promise<CreateContractReturnProps> {
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
        ? WarpFactory.forTestnet()
        : WarpFactory.forMainnet();

  if (params.environment == 'local' || params.environment == 'testnet') {
    warp.testing.addFunds(params.contractData.wallet as JWKInterface)
      .catch(e => console.log('ERROR', e.message));
  }

  const contract = await warp.deploy({
    wallet: params.contractData.wallet,
    initState: params.contractData.initState,
    src: params.contractData.src,
    tags: [{ 'name': 'Library-Used', 'value': 'PermawebJS' }],
  }).catch(e => console.log('ERROR', e.message));

  let status: number = 400;
  let statusText: string = "UNSUCCESSFUL";

  if (contract && contract.contractTxId != '' && contract.srcTxId != '') {
    status = 200;
    statusText = "SUCCESSFUL";
  };

  return {
    contract, result: { status, statusText }
  };
}

export async function writeContract(params: WriteContractProps) {
  // const contract = params.contract;

  // const writeContract = await params.contract.writeInteraction({
  //   ...params.options,
  // });

  // return { contract, writeContract };
}

export async function readContractState(params: ReadContractProps) {
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
        ? WarpFactory.forTestnet()
        : WarpFactory.forMainnet();

  const contract = warp.contract(params.contract.contractTxId).connect(params.wallet);

  return { contract, warp };
}
