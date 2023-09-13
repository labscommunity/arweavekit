import Arweave from 'arweave';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';
import * as Types from '../types/transaction';
import { Othent as othent } from 'othent';
import { ethers } from 'ethers';
import { appVersionTag } from '../utils';

async function initArweave(params: Types.InitArweaveProps) {
  let arweave: Arweave;
  const ArweaveClass: typeof Arweave = (Arweave as any)?.default ?? Arweave;
  if (params.environment === 'local') {
    arweave = ArweaveClass.init({
      host: 'localhost',
      port: 1984,
      protocol: 'http',
    });
  } else {
    arweave = ArweaveClass.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
  }

  return arweave;
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
      if (!params.key) {
        try {
          if (typeof window !== 'undefined' && window.ethereum) {
            const { WebBundlr } = await import('@bundlr-network/client');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            // @ts-ignore
            provider.getSigner = () => signer;

            // @ts-ignore
            signer._signTypedData = (domain, types, value) =>
              signer.signTypedData(domain, types, value);

            const bundlr = new WebBundlr(
              'https://node2.bundlr.network',
              'matic',
              provider
            );
            await bundlr.ready();

            const allTags = params?.options.tags && [
              appVersionTag,
              ...params?.options.tags,
            ];

            let transaction;

            if (
              params.data instanceof Buffer ||
              typeof params.data === 'string'
            ) {
              transaction = bundlr.createTransaction(params?.data, {
                tags: allTags ? allTags : [appVersionTag],
              });
            } else {
              throw new Error('Bundlr only accepts `string` and `Buffer`.');
            }
            await transaction.sign();
            const postedTransaction = await transaction.upload();

            return {
              transaction,
              postedTransaction,
            } as Types.CreateTransactionReturnProps<T>;
          } else {
            throw new Error('No Ethereum object found in window');
          }
        } catch (error: any) {
          console.error(error?.message || error);
          console.error('Posting with Bundlr failed, posting with Arweave.');
          // create transaction
          const transaction = await arweave.createTransaction({
            data: params.data,
          });

          // tags
          transaction.addTag(appVersionTag.name, appVersionTag.value);
          if (params?.options?.tags) {
            params?.options?.tags?.map((k, i) =>
              transaction.addTag(k.name, k.value)
            );
          }

          // sign and post
          await arweave.transactions.sign(transaction);
          const postedTransaction = await arweave.transactions.post(
            transaction
          );
          return {
            transaction,
            postedTransaction,
          } as Types.CreateTransactionReturnProps<T>;
        }
      } else {
        const { NodeBundlr } = await import('@bundlr-network/client');
        const bundlr = new NodeBundlr(
          'https://node2.bundlr.network',
          'arweave',
          params.key
        );

        const allTags = params?.options.tags && [
          appVersionTag,
          ...params?.options.tags,
        ];

        let transaction;

        if (params.data instanceof Buffer || typeof params.data === 'string') {
          transaction = bundlr.createTransaction(params?.data, {
            tags: allTags ? allTags : [appVersionTag],
          });
        } else {
          throw new Error('Bundlr only accepts `string` and `Buffer`.');
        }

        await transaction.sign();
        const postedTransaction = await transaction.upload();
        return {
          transaction,
          postedTransaction,
        } as Types.CreateTransactionReturnProps<T>;
      }
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

      // create transaction
      const transaction = await arweave.createTransaction(
        {
          data: params.data,
        },
        params.key ? params.key : 'use_wallet'
      );

      // tags
      transaction.addTag(appVersionTag.name, appVersionTag.value);
      if (params?.options?.tags) {
        params?.options?.tags?.map((k, i) =>
          transaction.addTag(k.name, k.value)
        );
      }

      // sign and post
      if (params.options?.signAndPost) {
        await arweave.transactions.sign(
          transaction,
          params.key ? params.key : 'use_wallet'
        );
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
      transaction.addTag(appVersionTag.name, appVersionTag.value);
      if (params?.options?.tags) {
        params?.options?.tags?.map((k, i) =>
          transaction.addTag(k.name, k.value)
        );
      }

      // signAndPost
      if (params.options?.signAndPost) {
        await arweave.transactions.sign(
          transaction,
          params.key ? params.key : 'use_wallet'
        );
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
    params.key ? params.key : 'use_wallet'
  );
  if (params?.postTransaction) {
    const postedTransaction = await arweave.transactions.post(
      params.createdTransaction
    );
    const createdTransaction = params.createdTransaction;
    return { createdTransaction, postedTransaction };
  } else {
    return params.createdTransaction as Transaction;
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
  const transaction = params.transaction;
  return { transaction, postedTransaction };
}

export async function getTransactionStatus(params: {
  transactionId: string;
  environment: 'local' | 'mainnet';
}) {
  const arweave = await initArweave({ environment: params.environment });
  const status = await arweave.transactions.getStatus(params.transactionId);

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

  return transaction;
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
  const allTags = params?.tags && [appVersionTag, ...params?.tags];

  let postedTransaction;

  if (params.useBundlr) {
    const signedTransaction = await othentInstance.signTransactionBundlr({
      othentFunction: params.othentFunction,
      data: params.data,
      tags: allTags ? allTags : [appVersionTag],
    });

    postedTransaction = await othentInstance.sendTransactionBundlr(
      signedTransaction
    );
  } else {
    const signedTransaction = await othentInstance.signTransactionArweave({
      othentFunction: params.othentFunction,
      data: params.data,
      tags: allTags ? allTags : [appVersionTag],
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
