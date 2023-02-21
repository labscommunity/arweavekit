import { WarpFactory } from 'warp-contracts';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { CreateProps, CreateReturnProps } from '../types/contract';

export async function createContract(
  params: CreateProps
): Promise<CreateReturnProps> {
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

export async function getContract(contractTxId: string) {
  const url = 'https://gateway.warp.cc/gateway';

  const getContract = await fetch(`${url}/contract?txId=${contractTxId}`, {
    method: 'GET',
  });

  const contract = await getContract.json();
  return { contract };
}
