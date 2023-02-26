import Arweave from 'arweave';
import Bundlr from '@bundlr-network/client';
import {
  CreateTransactionProps,
  PostTransactionProps,
  SignTransactionProps,
  GetTransactionData,
} from '../types/transaction';
import { getAddress, getBalance } from './wallet';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';

const arweaveLocal = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http',
});

const arweaveMainnet = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

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
  const arweave =
    !params.options?.environment || params.options.environment === 'mainnet'
      ? Arweave.init({
          host: 'arweave.net',
          port: 443,
          protocol: 'https',
        })
      : Arweave.init({
          host: 'localhost',
          port: 1984,
          protocol: 'http',
        });

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

      if (params?.options?.signAndPost) {
        await transaction.sign();
        const postedTransaction = await transaction.upload();
        return postedTransaction;
      } else {
        return transaction;
      }
    } else {
      // fund wallet if environment is local
      if (params.options?.environment === 'local') {
        await arweave.api
          .get(
            `mint/${await getAddress(params.key as JWKInterface)}/1000000000000`
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
      if (params.options?.signAndPost) {
        await arweave.transactions.sign(transaction, params.key);
        const postedTransaction = await arweave.transactions.post(transaction);
        return { transaction, postedTransaction };
      } else {
        return transaction;
      }
    }
  } else {
    // wallet transactions
    const senderAddress = await getAddress(params.key as JWKInterface);
    const senderBalance = await getBalance({
      address: senderAddress,
      environment: params.options?.environment
        ? params.options.environment
        : 'mainnet',
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
  if (params?.createdTransaction && params?.key) {
    if (params?.useBundlr) {
      const bundlr = new Bundlr(
        'http://node2.bundlr.network',
        'arweave',
        params?.key
      );

      const transaction = await params?.createdTransaction.sign();

      if (params?.postTransaction) {
        const postedTransaction = await params?.createdTransaction.upload();
        return { transaction, postedTransaction };
      } else {
        return transaction;
      }
    } else {
      if (params?.environment == 'local') {
        await arweaveLocal.transactions.sign(
          params?.createdTransaction as Transaction,
          params?.key
        );
      } else {
        await arweaveMainnet.transactions.sign(
          params?.createdTransaction as Transaction,
          params?.key
        );
      }
      if (params?.postTransaction) {
        let postedTransaction: {
          status: number;
          statusText: string;
          data: any;
        };

        if (params?.environment == 'local') {
          postedTransaction = await arweaveLocal.transactions.post(
            params?.createdTransaction
          );
        } else {
          postedTransaction = await arweaveMainnet.transactions.post(
            params?.createdTransaction
          );
        }
        return postedTransaction;
      } else {
        return params?.createdTransaction;
      }
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
  if (params?.transaction) {
    if (params?.useBundlr) {
      const bundlr = new Bundlr(
        'http://node2.bundlr.network',
        'arweave',
        params?.key
      );
      const postedTransaction = await params?.transaction.upload();
      return postedTransaction;
    } else {
      let postedTransaction: {
        status: number;
        statusText: string;
        data: any;
      };

      if (params?.environment == 'local') {
        postedTransaction = await arweaveLocal.transactions.post(
          params?.transaction
        );
      } else {
        postedTransaction = await arweaveMainnet.transactions.post(
          params?.transaction
        );
      }
      return postedTransaction;
    }
  } else {
    const postedTransaction = arweaveMainnet.transactions.post(
      params.transaction
    );
    return postedTransaction;
  }
}

export async function getTransactionStatus(params: {
  transactionId: string;
  environment?: 'local' | 'mainnet';
}) {
  let status: any;
  if (params?.environment == 'local') {
    status = await arweaveLocal.transactions.getStatus(params?.transactionId);
  } else {
    status = await arweaveMainnet.transactions.getStatus(params?.transactionId);
  }

  return status;
}

/**
 *
 * @params transactionId
 * @params options { data:boolean, tags: boolean}
 * @returns Transaction
 */
export async function getTransaction(params: GetTransactionData) {
  const transaction = await arweaveMainnet.transactions.get(
    params?.transactionId
  );
  let txTags, txData;

  if (params?.options?.tags) {
    txTags = transaction.tags.forEach((tag) => {
      let key = tag.get('name', { decode: true, string: true });
      let value = tag.get('value', { decode: true, string: true });

      return { key, value };
    });
  } else if (params?.options?.data) {
    txData = await arweaveMainnet.transactions.getData(params?.transactionId);
  }

  return params?.options?.data
    ? txData
    : params?.options?.tags
    ? { transaction, tags: txTags }
    : params?.options?.data && params?.options?.tags
    ? { transactionData: txData, tags: txTags }
    : transaction;
}
