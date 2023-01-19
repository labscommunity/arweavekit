import { ArWallet, WarpFactory } from 'warp-contracts';
import {
  CreateContractProps,
  CreateContractReturnProps,
  ReadContractProps,
  WriteContractProps,
} from '../../types/contract';

export async function createContract(
  params: CreateContractProps,
): Promise<CreateContractReturnProps> {
  const warp =
    params.environment === 'local'
      ? WarpFactory.forLocal()
      : params.environment === 'testnet'
      ? WarpFactory.forTestnet()
      : WarpFactory.forMainnet();

  const deployContract = async (props: {
    wallet: ArWallet;
    state: string;
    contractSource: string;
  }) => {
    const { contractTxId } = await warp.deploy({
      wallet: props.wallet,
      initState: props.state,
      src: props.contractSource,
    });

    const contract = warp.contract(contractTxId).connect(props.wallet);

    return { contractTxId, contract };
  };

  if (!params.wallet) {
    const { jwk } = await warp.generateWallet();
    const wallet = jwk;

    const { contract, contractTxId } = await deployContract({
      wallet,
      state: params.initialState,
      contractSource: params.contractSource,
    });

    return { wallet, contract, contractTxId };
  }

  const { contract, contractTxId } = await deployContract({
    wallet: params.wallet,
    state: params.initialState,
    contractSource: params.contractSource,
  });

  return { contract, contractTxId };
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
