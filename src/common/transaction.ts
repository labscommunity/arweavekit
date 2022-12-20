import Arweave from 'arweave';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { CreateTransactionProps, CreateTransactionReturnProps } from '../types/transaction';

const arweaveMainnet = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

/**
 * create wallet
 * @params
 * data?: string | Uint8Array | ArrayBuffer;
 * options?: {
    tags: Tag[];
    quantity?: string;
    target?: string;
    uploadLargeBatch?: boolean
  };
 * key?: JWKInterface;
 * @returns
 * format: number;
 * id: string,
 * last_tx: string;
 * owner: string;
 * tags: Tag[];
 * target: string;
 * quantity: string;
 * data: string | Uint8Array | ArrayBuffer;
 * data_size: string;
 * data_root: string;
 * data_tree: [];
 * reward: string;
 * signature: string;
 */

export async function createTransaction(
  params: CreateTransactionProps): Promise<CreateTransactionReturnProps | string> {
  if (params.data) {
    const txn = await arweaveMainnet.createTransaction({
      data: params.data,
    }, params.key ? params.key : 'use_wallet');
    return txn;
  } else if (params.target && params.quantity) {
    const txn = await arweaveMainnet.createTransaction({
      target: params.target,
      quantity: params.quantity,
    }, params.key ? params.key : 'use_wallet');
    return txn;
  }
  // When neither data nor token quantity and target are provided
  return 'Pass in valid data or token quantity and target to create a transaction.'
}