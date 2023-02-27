import Bundlr from '@bundlr-network/client';
import { initArweave } from '../utils';
import {
  CreateTransactionProps,
  PostTransactionProps,
  SignTransactionProps,
  GetTransactionData,
} from '../types/transaction';
import { getAddress, getBalance } from './wallet';
import Transaction from 'arweave/node/lib/transaction';

/**
 * create transaction
 * @params
 * data?: string | Uint8Array | ArrayBuffer;
 * quantity?: string;
 * target?: string;
 * options?: {
    tags?: Tag[];
    useBundlr?: boolean;
    signAndPost?: boolean;
    environment?: 'local' | 'mainnet'
  };
 * key: JWKInterface;
 * @returns transaction data (Data types from Arweave or Bundlr) | string
 */
export async function createTransaction(params: CreateTransactionProps) {
  // check and default env to mainnet
  const arweave = initArweave(params.environment);

  if (params.type === 'data') {
    // use useBundlr
    if (params.options?.useBundlr) {
      const bundlr = new Bundlr(
        'http://node2.bundlr.network',
        'arweave',
        params.key
      );

      const allTags = params?.options.tags && [
        {
          name: 'PermawebJS',
          value: '1.0.0',
        },
        ...params?.options.tags,
      ];

      const transaction = bundlr.createTransaction(
        JSON.stringify(params?.data),
        {
          tags: allTags ? allTags : [{ name: 'PermawebJS', value: '1.0.0' }],
        }
      );

      if (params.options.signAndPost === false) {
        return { transaction };
      } else {
        await transaction.sign();
        const postedTransaction = await transaction.upload();
        return { transaction, postedTransaction };
      }
    } else {
      // fund wallet if environment is testnet
      if (params.environment === 'testnet') {
        await arweave.api
          .get(
            `mint/${await getAddress({
              key: params.key,
              environment: 'testnet',
            })}/1000000000000`
          )
          .catch((error) => console.error(error));
      }

      // create transaction
      const transaction = await arweave.createTransaction(
        {
          data: Buffer.isBuffer(params.data)
            ? Buffer.from(`${params.data}`, 'utf8')
            : params.data,
        },
        params.key
      );

      // tags
      transaction.addTag('PermawebJS', '1.0.0');
      if (params?.options?.tags) {
        params?.options?.tags?.map((k, i) =>
          transaction.addTag(k.name, k.value)
        );
      }

      // sign and post
      if (!params.options?.signAndPost) {
        await arweave.transactions.sign(transaction, params.key);
        const postedTransaction = await arweave.transactions.post(transaction);
        return { transaction, postedTransaction };
      } else {
        return transaction;
      }
    }
  } else {
    // wallet transactions
    const senderAddress = await getAddress({
      key: params.key,
      environment: 'testnet',
    });
    const senderBalance = await getBalance({
      address: senderAddress,
      environment: 'testnet',
    });

    if (parseInt(senderBalance) >= parseInt(params?.quantity as string)) {
      // create txn
      const transaction = await arweave.createTransaction(
        {
          target: params.target,
          quantity: params.quantity,
        },
        params.key
      );

      // add tags
      transaction.addTag('PermawebJS', '1.0.0');
      if (params?.options?.tags) {
        params?.options?.tags?.map((k, i) =>
          transaction.addTag(k.name, k.value)
        );
      }

      // signAndPost
      if (params.options?.signAndPost) {
        await arweave.transactions.sign(transaction, params.key);
        const postedTransaction = await arweave.transactions.post(transaction);
        return { transaction, postedTransaction };
      } else {
        return transaction;
      }
    } else {
      return 'insufficient funds to complete transaction';
    }
  }
}

/**
 * sign transaction
 * @params
 * createdTransaction: Transaction (Data type from Arweave) | BundlrTransaction (Data type from Bundlr)
 * key?: JWKInterface
 * useBundlr?: boolean
 * postTransaction?: boolean
 * environment?: 'local' | 'mainnet'
 * @returns transaction data (Data types from Arweave or Bundlr) | string
 */

export async function signTransaction(params: SignTransactionProps) {
  const arweave = initArweave(params.environment);

  if (params?.useBundlr) {
    const transaction = await params?.createdTransaction.sign();

    if (params?.postTransaction) {
      const postedTransaction = await params?.createdTransaction.upload();
      return { transaction, postedTransaction };
    } else {
      return transaction;
    }
  } else {
    await arweave.transactions.sign(
      params.createdTransaction as Transaction,
      params.key
    );
    if (params?.postTransaction) {
      const postedTransaction = await arweave.transactions.post(
        params.createdTransaction
      );
      return postedTransaction;
    } else {
      return params.createdTransaction;
    }
  }
}

/**
 * post transaction
 * @params
 * transaction: Transaction (Data type from Arweave) | BundlrTransaction (Data type from Bundlr)
 * key?: JWKInterface
 * useBundlr?: boolean
 * environment?: 'local' | 'mainnet'
 * @returns transaction data (Data types from Arweave or Bundlr) | string
 */

export async function postTransaction(params: PostTransactionProps) {
  const arweave = initArweave(params.environment);

  if (params?.useBundlr) {
    const postedTransaction = await params.transaction.upload();
    return postedTransaction;
  } else {
    const postedTransaction = await arweave.transactions.post(
      params.transaction
    );

    return postedTransaction;
  }
}

export async function getTransactionStatus(params: {
  transactionId: string;
  environment: 'testnet' | 'mainnet';
}) {
  const arweave = initArweave(params.environment);

  let status: any;
  status = await arweave.transactions.getStatus(params.transactionId);
  return status;
}

/**
 *
 * @params transactionId
 * @params options { data:boolean, tags: boolean}
 * @returns Transaction
 */
export async function getTransaction(params: GetTransactionData) {
  const arweave = initArweave(params.environment);
  const transaction = await arweave.transactions.get(params.transactionId);
  let txTags, txData;

  if (params.options?.tags) {
    txTags = transaction.tags.forEach((tag) => {
      let key = tag.get('name', { decode: true, string: true });
      let value = tag.get('value', { decode: true, string: true });

      return { key, value };
    });
  } else if (params.options?.data) {
    txData = await arweave.transactions.getData(params?.transactionId);
  }

  return params.options?.data
    ? txData
    : params?.options?.tags
    ? { transaction, tags: txTags }
    : params?.options?.data && params?.options?.tags
    ? { transactionData: txData, tags: txTags }
    : transaction;
}
