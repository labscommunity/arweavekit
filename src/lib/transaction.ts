import Arweave from 'arweave';
import NodeBundlr from '@bundlr-network/client/build/esm/node/bundlr';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';
import * as Types from '../types/transaction';
import { Othent as othent } from 'othent';

async function initArweave(params: Types.InitArweaveProps) {
  let arweave;
  if (params.environment === 'local') {
    arweave = Arweave.init({
      host: 'localhost',
      port: 1984,
      protocol: 'http',
    });
  } else {
    arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
  }

  return arweave;
}

async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer) {
        resolve(result);
      } else {
        reject(new Error('Failed to convert file to ArrayBuffer.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error occurred while reading the file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * create transaction
 * @params CreateTransactionProps
 * @returns Transaction | Bundlr Transaction
 */
export async function createTransaction<
  T extends
    | Types.CreateWalletTransactionProps
    | Types.CreateAndPostWalletTransactionProps
    | Types.CreateDataTransactionProps
    | Types.CreateAndPostDataTransactionProps
    | Types.CreateBundledDataTransactionProps
    | Types.CreateAndPostBundledDataTransactionProps
>(params: T): Promise<Types.CreateTransactionReturnProps<T>> {
  // init arweave instance
  const arweave = await initArweave({ environment: params.environment });

  // check and default env to mainnet
  if (params.type === 'data') {
    // use useBundlr
    if (params.options?.useBundlr) {
      const bundlr = new NodeBundlr(
        'http://node2.bundlr.network',
        'arweave',
        params.key
      );

      const allTags = params?.options.tags && [
        {
          name: 'ArweaveKit',
          value: '1.4.0',
        },
        ...params?.options.tags,
      ];

      const transaction = bundlr.createTransaction(
        JSON.stringify(params?.data),
        {
          tags: allTags ? allTags : [{ name: 'ArweaveKit', value: '1.4.0' }],
        }
      );

      await transaction.sign();
      const postedTransaction = await transaction.upload();
      return {
        transaction,
        postedTransaction,
      } as Types.CreateTransactionReturnProps<T>;
    } else {
      // fund wallet if environment is local
      if (params.environment === 'local' && params.options?.signAndPost) {
        await arweave.api
          .get(
            `mint/${await arweave.wallets.getAddress(
              params.key as JWKInterface
            )}/1000000000000`
          )
          .catch((error) => console.error(error));
      }

      let data;

      if (typeof params.data === 'string') {
        data = params.data;
      } else if (params.data instanceof Uint8Array) {
        data = params.data;
      } else if (params.data instanceof ArrayBuffer) {
        data = params.data;
      } else if (params.data instanceof File) {
        data = await fileToArrayBuffer(params.data);
      } else {
        throw new TypeError('Unsupported data type');
      }

      // create transaction
      const transaction = await arweave.createTransaction(
        {
          data: data,
        },
        params.key ? params.key : 'use_wallet'
      );

      // tags
      transaction.addTag('ArweaveKit', '1.4.0');
      if (params?.options?.tags) {
        params?.options?.tags?.map((k, i) =>
          transaction.addTag(k.name, k.value)
        );
      }

      if (params.data instanceof File) {
        transaction.addTag('Content-Type', params.data.type);
      }

      // sign and post
      if (params.options?.signAndPost) {
        await arweave.transactions.sign(transaction, params.key);
        const postedTransaction = await arweave.transactions.post(transaction);
        return {
          transaction,
          postedTransaction,
        } as Types.CreateTransactionReturnProps<T>;
      } else {
        return transaction as Types.CreateTransactionReturnProps<T>;
      }
    }
  } else {
    // wallet transactions
    let senderAddress = '';
    let senderBalance = '';

    if (params.key) {
      senderAddress = await arweave.wallets.getAddress(
        params.key as JWKInterface
      );
      senderBalance = await arweave.wallets.getBalance(senderAddress);
      console.log('This is the sender bal from the function', senderBalance);
      console.log(
        'This is the sender bal from the function as parseInt',
        parseInt(senderBalance)
      );
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
      transaction.addTag('ArweaveKit', '1.4.0');
      if (params?.options?.tags) {
        params?.options?.tags?.map((k, i) =>
          transaction.addTag(k.name, k.value)
        );
      }

      // signAndPost
      if (params.options?.signAndPost) {
        await arweave.transactions.sign(transaction, params.key);
        const postedTransaction = await arweave.transactions.post(transaction);
        return {
          transaction,
          postedTransaction,
        } as Types.CreateTransactionReturnProps<T>;
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
  const arweave = await initArweave({ environment: params.environment });

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

/**
 * post transaction
 * @params PostTransactionProps
 * @returns PostedTransaction
 */

export async function postTransaction(params: Types.PostTransactionProps) {
  const arweave = await initArweave({ environment: params.environment });

  const postedTransaction = await arweave.transactions.post(params.transaction);

  return postedTransaction;
}

export async function getTransactionStatus(params: {
  transactionId: string;
  environment: 'local' | 'mainnet';
}) {
  const arweave = await initArweave({ environment: params.environment });

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
  const arweave = await initArweave({ environment: params.environment });
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

export async function createAndPostTransactionWOthent(
  params: Types.CreateandPostTransactionWOthentProps
): Promise<Types.CreateandPostTransactionWOthentReturnProps> {
  const othentInstance = await othent({
    API_ID: params.apiId,
  });
  const allTags = params?.tags && [
    {
      name: 'ArweaveKit',
      value: '1.4.0',
    },
    ...params?.tags,
  ];

  let postedTransaction;

  if (params.useBundlr) {
    const signedTransaction = await othentInstance.signTransactionBundlr({
      othentFunction: params.othentFunction,
      data: params.data,
      tags: allTags ? allTags : [{ name: 'ArweaveKit', value: '1.4.0' }],
    });

    postedTransaction = await othentInstance.sendTransactionBundlr(
      signedTransaction
    );
  } else {
    const signedTransaction = await othentInstance.signTransactionArweave({
      othentFunction: params.othentFunction,
      data: params.data,
      tags: allTags ? allTags : [{ name: 'ArweaveKit', value: '1.4.0' }],
    });

    postedTransaction = await othentInstance.sendTransactionArweave(
      signedTransaction
    );
  }

  if (postedTransaction.success) {
    return postedTransaction as Types.CreateandPostTransactionWOthentReturnProps;
  } else {
    throw new Error('Transaction creation unsuccessful.');
  }
}
