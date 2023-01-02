import { ArWallet, WarpFactory } from 'warp-contracts';
import {
  CreateContractProps,
  CreateContractReturnProps,
  ReadContractProps,
  WriteContractProps,
} from '../types/contract';

export async function createContract(
  input: CreateContractProps
): Promise<CreateContractReturnProps> {
  const warp =
    input.environment === 'local'
      ? WarpFactory.forLocal()
      : input.environment === 'testnet'
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

  if (!input.wallet) {
    const { jwk } = await warp.generateWallet();
    const wallet = jwk;

    const { contract, contractTxId } = await deployContract({
      wallet,
      state: input.initialState,
      contractSource: input.contractSource,
    });

    return { wallet, contract, contractTxId };
  }

  const { contract, contractTxId } = await deployContract({
    wallet: input.wallet,
    state: input.initialState,
    contractSource: input.contractSource,
  });

  return { contract, contractTxId };
}

export async function writeContract(input: WriteContractProps) {
  const contract = input.contract;

  const writeContract = await input.contract.writeInteraction({
    ...input.options,
  });

  return { contract, writeContract };
}

export async function readContractState(input: ReadContractProps) {
  const { cachedValue, sortKey } = await input.contract.readState();

  return { cachedValue, sortKey };
}
