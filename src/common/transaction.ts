import Arweave from 'arweave';
import Bundlr from '@bundlr-network/client';
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
 * quantity?: string;
 * target?: string;
 * options?: {
    tags?: Tag[];
    useBundlr?: boolean;
    signAndPost: boolean
  };
 * key?: JWKInterface;
 * @returns Arweave Transaction
 */

/* 

Rethinking logic defaulting to bundlr
- Data vs Wallet to Wallet Txns
- use Arweave
- sign and post transactions
- tags
*/

export async function createTransaction(params?: CreateTransactionProps) {
  // Check is transaction is for data or wallet to wallet
  if (params?.data) {
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
      if (params.options?.signAndPost) {
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
      if (params.options?.signAndPost) {
        await arweaveMainnet.transactions.sign(txn, params.key);
        const response = await arweaveMainnet.transactions.post(txn);
        return { txn, response };
      } else {
        return txn;
      }
    }
  } else if (params?.target && params?.quantity) {
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
      if (params.options?.signAndPost) {
        await arweaveMainnet.transactions.sign(txn, params.key);
        const response = await arweaveMainnet.transactions.post(txn);
        return { txn, response };
      } else {
        return txn;
      }
    } else {
      return 'Wallet does not have sufficient balance to complete transaction.';
    }
  } else if (params?.data && params?.target && params?.quantity) {
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
      if (params.options?.signAndPost) {
        await arweaveMainnet.transactions.sign(txn, params.key);
        const response = await arweaveMainnet.transactions.post(txn);
        return { txn, response };
      } else {
        return txn;
      }
    } else {
      return 'Wallet does not have sufficient balance to complete transaction.';
    }
  } else {
    // When neither data nor token quantity and target are provided
    return 'Pass in valid data or token quantity and target to create a transaction.';
  }
}
