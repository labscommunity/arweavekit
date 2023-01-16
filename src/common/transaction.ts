import Arweave from 'arweave';
import Bundlr from '@bundlr-network/client';
import { JWKInterface } from 'arweave/node/lib/wallet';
import {
  CreateTransactionProps,
  PostTransactionProps,
  SignTransactionProps,
} from '../types/transaction';
import { getAddress, getBalance } from './wallet';
import Transaction from 'arweave/node/lib/transaction';

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
- Data vs Wallet to Wallet transactions
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
      const transaction = bundlr.createTransaction(
        JSON.stringify(params.data),
        { tags: params.options.tags }
      );
      if (params.options?.signAndPost) {
        await transaction.sign();
        const postedTransaction = await transaction.upload();
        return postedTransaction;
      } else {
        return transaction;
      }
    } else {
      const transaction = await arweaveMainnet.createTransaction(
        {
          data: params.data,
        },
        params.key ? params.key : 'use_wallet'
      );
      params.options?.tags?.map((k, i) => transaction.addTag(k.name, k.value));
      if (params.options?.signAndPost) {
        await arweaveMainnet.transactions.sign(transaction, params.key);
        const postedTransaction = await arweaveMainnet.transactions.post(
          transaction
        );
        return { transaction, postedTransaction };
      } else {
        return transaction;
      }
    }
  } else if (params?.target && params?.quantity) {
    let senderBalance: string = '';
    if (params.key) {
      const senderAddress = await getAddress(params.key);
      senderBalance = await getBalance(senderAddress);
    }
    if (parseInt(senderBalance) >= parseInt(params.quantity)) {
      const transaction = await arweaveMainnet.createTransaction(
        {
          target: params.target,
          quantity: params.quantity,
        },
        params.key ? params.key : 'use_wallet'
      );
      params.options?.tags?.map((k, i) => transaction.addTag(k.name, k.value));
      if (params.options?.signAndPost) {
        await arweaveMainnet.transactions.sign(transaction, params.key);
        const postedTransaction = await arweaveMainnet.transactions.post(
          transaction
        );
        return { transaction, postedTransaction };
      } else {
        return transaction;
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
      const transaction = await arweaveMainnet.createTransaction(
        {
          data: params.data,
          target: params.target,
          quantity: params.quantity,
        },
        params.key ? params.key : 'use_wallet'
      );
      params.options?.tags?.map((k, i) => transaction.addTag(k.name, k.value));
      if (params.options?.signAndPost) {
        await arweaveMainnet.transactions.sign(transaction, params.key);
        const postedTransaction = await arweaveMainnet.transactions.post(
          transaction
        );
        return { transaction, postedTransaction };
      } else {
        return transaction;
      }
    } else {
      return 'Wallet does not have sufficient balance to complete transaction.';
    }
  } else {
    // When neither data nor token quantity and target are provided
    return 'Pass in valid data or token quantity and target to create a transaction.';
  }
  // When neither data nor token quantity and target are provided
  return 'Pass in valid data or token quantity and target to create a transaction.';
}

export async function signTransaction(params: SignTransactionProps) {
  if (params.createdTransaction && params.key) {
    if (params.useBundlr) {
      const bundlr = new Bundlr(
        'http://node2.bundlr.network',
        'arweave',
        params.key
      );
      const transaction = await params.createdTransaction.sign();
      if (params.postTransaction) {
        const postedTransaction = await params.createdTransaction.upload();
        return { transaction, postedTransaction };
      } else {
        return transaction;
      }
    } else {
      await arweaveMainnet.transactions.sign(
        params.createdTransaction as Transaction,
        params.key
      );
      if (params.postTransaction) {
        const postedTransaction = await arweaveMainnet.transactions.post(
          params.createdTransaction
        );
        return { postedTransaction };
      } else {
        return params.createdTransaction;
      }
    }
  } else {
    return 'Pass in valid created transaction and the key with which it was created.';
  }
}

export async function postTransaction(params: PostTransactionProps) {
  if (params.transaction) {
    if (params.useBundlr) {
      const bundlr = new Bundlr(
        'http://node2.bundlr.network',
        'arweave',
        params.key
      );
      const postedTransaction = await params.transaction.upload();
      return postedTransaction;
    } else {
      const postedTransaction = arweaveMainnet.transactions.post(
        params.transaction
      );
      return postedTransaction;
    }
  } else {
    return 'Pass in valid signed transaction.';
  }
}

export async function getTransactionStatus(transactionId: string) {
  const status = await arweaveMainnet.transactions.getStatus(transactionId);

  return status;
}
