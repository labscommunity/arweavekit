import Arweave from 'arweave';
import Bundlr from '@bundlr-network/client';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { CreateTransactionProps } from '../types/transaction';
import { getAddress, getBalance } from './wallet';

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

/* 

Rethinking logic defaulting to bundlr
- Data vs Wallet to Wallet Txns
- use Arweave
- sign and post transactions
- tags
*/

export async function createTransaction(params: CreateTransactionProps) {
  // Check is transaction is for data or wallet to wallet
  if (params.data) {
    // Check whether to use @bundlr-network/client or arweave
    if (params.options?.useBundlr) {
      const bundlr = new Bundlr(
        'http://node2.bundlr.network',
        'arweave',
        params.key
      );
      const txn = bundlr.createTransaction(JSON.stringify(params.data), {
        tags: params.options.tags,
      });
      if (params.options?.signAndPostTxn) {
        await txn.sign();
        const response = await txn.upload();
        return response;
      } else {
        return txn;
      }
    } else {
      const txn = await arweaveMainnet.createTransaction(
        {
          data: params.data,
        },
        params.key ? params.key : 'use_wallet'
      );
      params.options?.tags?.map((k, i) => txn.addTag(k.name, k.value));
      if (params.options?.signAndPostTxn) {
        await arweaveMainnet.transactions.sign(txn, params.key);
        const response = await arweaveMainnet.transactions.post(txn);
        return { txn, response };
      } else {
        return txn;
      }
    }
  } else if (params.target && params.quantity) {
    let senderBalance: string = '';
    if (params.key) {
      const senderAddress = await getAddress(params.key);
      senderBalance = await getBalance(senderAddress);
    }
    if (parseInt(senderBalance) >= parseInt(params.quantity)) {
      const txn = await arweaveMainnet.createTransaction(
        {
          target: params.target,
          quantity: params.quantity,
        },
        params.key ? params.key : 'use_wallet'
      );
      params.options?.tags?.map((k, i) => txn.addTag(k.name, k.value));
      if (params.options?.signAndPostTxn) {
        await arweaveMainnet.transactions.sign(txn, params.key);
        const response = await arweaveMainnet.transactions.post(txn);
        return { txn, response };
      } else {
        return txn;
      }
    } else {
      return 'Wallet does not have sufficient balance to complete transaction.';
    }
  } else if (params.data && params.target && params.quantity) {
    let senderBalance: string = '';
    if (params.key) {
      const senderAddress = await getAddress(params.key);
      senderBalance = await getBalance(senderAddress);
    }
    if (parseInt(senderBalance) >= parseInt(params.quantity)) {
      const txn = await arweaveMainnet.createTransaction(
        {
          data: params.data,
          target: params.target,
          quantity: params.quantity,
        },
        params.key ? params.key : 'use_wallet'
      );
      params.options?.tags?.map((k, i) => txn.addTag(k.name, k.value));
      if (params.options?.signAndPostTxn) {
        await arweaveMainnet.transactions.sign(txn, params.key);
        const response = await arweaveMainnet.transactions.post(txn);
        return { txn, response };
      } else {
        return txn;
      }
    } else {
      return 'Wallet does not have sufficient balance to complete transaction.';
    }
  }
  // When neither data nor token quantity and target are provided
  return 'Pass in valid data or token quantity and target to create a transaction.';
}
