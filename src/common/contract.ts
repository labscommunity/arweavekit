import { ArWallet, WarpFactory } from 'warp-contracts';
import {
  CreateContractProps,
  CreateContractReturnProps,
  ReadContractProps,
  WriteContractProps,
} from '../../types/contract';

export async function createContract(
  params: CreateContractProps
): Promise<CreateContractReturnProps> {
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
        ? WarpFactory.forTestnet()
        : WarpFactory.forMainnet();

  const contract = await warp.deploy({
    wallet: params.contractData.wallet,
    initState: params.contractData.initState,
    src: params.contractData.src,
  });

  let status: number = 400;
  let statusText: string = "UNSUCCESSFUL";

  if (contract && contract.contractTxId != '' && contract.srcTxId != '') {
    status = 200;
    statusText = "SUCCESSFUL";
  }

  // const contract = warp.contract(contractTxId).connect(params.contractData.wallet);

  return {
    contract, result: { status, statusText }
  };
}

export async function writeContract(params: WriteContractProps) {
  const contract = params.contract;

  const writeContract = await params.contract.writeInteraction({
    ...params.options,
  });

  return { contract, writeContract };
}

export async function readContractState(params: ReadContractProps) {
  const { cachedValue, sortKey } = await params.contract.readState();

  return { cachedValue, sortKey };
}
