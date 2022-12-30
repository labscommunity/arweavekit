import { ArWallet, WarpFactory } from 'warp-contracts';
import {
  CreateContractProps,
  CreateContractReturnProps,
} from '../types/contract';

export async function createContract(
  input: CreateContractProps
): Promise<CreateContractReturnProps> {
  // configure warp
  const warp =
    input.environment === 'local'
      ? WarpFactory.forLocal()
      : input.environment === 'testnet'
      ? WarpFactory.forTestnet()
      : WarpFactory.forMainnet();

  // function to deploy contracts using warp
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

  // create new wallet if wallet is not passed in
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
