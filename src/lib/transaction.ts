import Bundlr from '@bundlr-network/client';
import Transaction from 'arweave/node/lib/transaction';
import { initArweave } from '../utils';
import { getAddress, getBalance } from './wallet';
import { JWKInterface } from 'arweave/node/lib/wallet';
import * as Types from '../types/transaction';
import othent from 'othent';

/**
 * create transaction
 * @params CreateTransactionProps
 * @returns Transaction | Bundlr Transaction
 */
export async function createTransaction<T extends Types.CreateWalletTransactionProps | Types.CreateAndPostWalletTransactionProps | Types.CreateDataTransactionProps | Types.CreateAndPostDataTransactionProps | Types.CreateBundledDataTransactionProps | Types.CreateAndPostBundledDataTransactionProps>(params: T): Promise<Types.CreateTransactionReturnProps<T>> {
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
          value: '1.2.00',
        },
        ...params?.options.tags,
      ];

      const transaction = bundlr.createTransaction(
        JSON.stringify(params?.data),
        {
          tags: allTags ? allTags : [{ name: 'PermawebJS', value: '1.2.00' }],
        }
      );

      if (params.options?.signAndPost) {
        await transaction.sign();
        const postedTransaction = await transaction.upload();
        return { transaction, postedTransaction } as Types.CreateTransactionReturnProps<T>;
      } else {
        return transaction as Types.CreateTransactionReturnProps<T>;
      }
    } else {
      // fund wallet if environment is local
      if (params.environment === 'local' && params.options?.signAndPost) {
        await arweave.api
          .get(
            `mint/${await getAddress({
              key: params.key as JWKInterface,
              environment: 'local',
            })}/1000000000000`
          )
          .catch((error) => console.error(error));
      }

      // create transaction
      const transaction = await arweave.createTransaction(
        {
          data: (Buffer.isBuffer(params.data))
            ? Buffer.from(`${params.data}`, 'utf8')
            : params.data,
        },
        params.key ? params.key : 'use_wallet'
      );

      // tags
      transaction.addTag('PermawebJS', '1.2.00');
      if (params?.options?.tags) {
        params?.options?.tags?.map((k, i) =>
          transaction.addTag(k.name, k.value)
        );
      }

      // sign and post
      if (params.options?.signAndPost) {
        await arweave.transactions.sign(transaction, params.key);
        const postedTransaction = await arweave.transactions.post(transaction);
        return { transaction, postedTransaction } as Types.CreateTransactionReturnProps<T>;
      } else {
        return transaction as Types.CreateTransactionReturnProps<T>;
      }
    }
  } else {
    // wallet transactions
    let senderAddress = '';
    let senderBalance = '';

    if (params.key) {
      senderAddress = await getAddress({
        key: params.key as JWKInterface,
        environment: 'local',
      });
      senderBalance = await getBalance({
        address: senderAddress,
        environment: 'local',
      });
    }

    if (parseInt(senderBalance) >= parseInt(params?.quantity as string)) {
      // create txn
      const transaction = await arweave.createTransaction(
        {
          target: params.target,
          quantity: params.quantity,
        },
        params.key ? params.key : 'use_wallet'
      );

      // add tags
      transaction.addTag('PermawebJS', '1.2.00');
      if (params?.options?.tags) {
        params?.options?.tags?.map((k, i) =>
          transaction.addTag(k.name, k.value)
        );
      }

      // signAndPost
      if (params.options?.signAndPost) {
        await arweave.transactions.sign(transaction, params.key);
        const postedTransaction = await arweave.transactions.post(transaction);
        return { transaction, postedTransaction } as Types.CreateTransactionReturnProps<T>;
      } else {
        return transaction as Types.CreateTransactionReturnProps<T>;
      }
    } else {
      throw new Error('insufficient funds to complete transaction');
    }
  }
}

/**
 * sign transaction
 * @params SignTransactionProps
 * @returns SignedTransaction
 */

export async function signTransaction(params: Types.SignTransactionProps) {
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
 * @params PostTransactionProps
 * @returns PostedTransaction
 */

export async function postTransaction(params: Types.PostTransactionProps) {
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
  environment: 'local' | 'mainnet';
}) {
  const arweave = initArweave(params.environment);

  let status: any;
  status = await arweave.transactions.getStatus(params.transactionId);
  return status;
}

/**
 *
 * @params GetTransactionProps
 * @returns Transaction
 */
export async function getTransaction(params: Types.GetTransactionProps) {
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

/**
 * CreateandPostTransactionWOthent
 * @params CreateandPostTransactionWOthentProps
 * @returns CreateandPostTransactionWOthentReturnProps
 */

export async function createAndPostTransactionWOthent(params: Types.CreateandPostTransactionWOthentProps): Promise<Types.CreateandPostTransactionWOthentReturnProps> {
  const allTags = params?.tags && [
    {
      name: 'PermawebJS',
      value: '1.2.00',
    },
    ...params?.tags,
  ];

  const signedTransaction = await othent.signTransactionArweave({
    othentFunction: params.othentFunction,
    data: params.data,
    tags: allTags ? allTags : [{ name: 'PermawebJS', value: '1.2.00' }],
  });

  const postedTransaction = await othent.sendTransactionArweave(signedTransaction);

  if (postedTransaction.success) {

    return postedTransaction as Types.CreateandPostTransactionWOthentReturnProps;
  } else {
    throw new Error("Transaction creation unsuccessful.");
  }
}