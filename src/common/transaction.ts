import Arweave from 'arweave';
import Bundlr from '@bundlr-network/client';
import {
  CreateTransactionProps,
  PostTransactionProps,
  SignTransactionProps,
  GetTransactionData,
} from '../../types/transaction';
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

export async function createTransaction(params?: CreateTransactionProps) {
  // Check is transaction is for data or wallet to wallet
  if (params?.data) {
    // Check whether to use @bundlr-network/client or arweave
    if (params.options?.useBundlr) {
      let bundlr: Bundlr;
      if (params.options.environment == 'local') {
        bundlr = new Bundlr(
          'https://devnet.bundlr.network',
          'arweave',
          params.key
        );
      } else {
        bundlr = new Bundlr(
          'http://node2.bundlr.network',
          'arweave',
          params.key
        );
      }

      const allTags = params.options.tags && [
        {
          name: 'PermawebJS',
          value: '1.0.0',
        },
        ...params.options.tags,
      ];
      const transaction = bundlr.createTransaction(
        JSON.stringify(params.data),
        {
          tags: allTags ? allTags : [{ name: 'PermawebJS', value: '1.0.0' }],
        }
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
      if (params.options?.tags) {
        transaction.addTag('PermawebJS', '1.0.0');
        params.options?.tags?.map((k, i) =>
          transaction.addTag(k.name, k.value)
        );
      }
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
      senderBalance = await getBalance({ address: senderAddress });
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
      senderBalance = await getBalance({ address: senderAddress });
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
    return 'Pass in valid data or token quantity and target to create a transaction.';
  }
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

/**
 *
 * @returns getTransaction(id) transaction
 * @returns getTransaction(id, { options: data: true}) only data
 * @returns getTransaction(id, { options: tags: true}) transaction and tags
 * @returns getTransaction(id, { options: data: true, tags: true }) only data and tags
 */
export async function getTransaction(input: GetTransactionData) {
  const transaction = await arweaveMainnet.transactions.get(
    input.transactionId
  );
  let txTags, txData;

  if (input.options?.tags) {
    txTags = transaction.tags.forEach((tag) => {
      let key = tag.get('name', { decode: true, string: true });
      let value = tag.get('value', { decode: true, string: true });

      return { key, value };
    });
  } else if (input.options?.data) {
    txData = await arweaveMainnet.transactions.getData(input.transactionId);
  }

  return input.options?.data
    ? txData
    : input.options?.tags
      ? { transaction, tags: txTags }
      : input.options?.data && input.options?.tags
        ? { transactionData: txData, tags: txTags }
        : transaction;
}
