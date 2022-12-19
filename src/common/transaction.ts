import arweave from '../utils';
import { GetTransactionData, SignTransactionProps } from '../types/transaction';

/**
 * sign transaction
 * @returns trasaction data
 */

export async function signTransaction(input: SignTransactionProps) {
  if (!input?.transaction && !input?.key) {
    const key = await arweave.wallets.generate();
    let transaction;

    if (input.options.type === 'data') {
      const { options } = input;
      transaction = await arweave.createTransaction(
        {
          data: options.data,
        },
        key
      );
    } else if (input.options.type === 'wallet') {
      const { address, quantity } = input.options;
      transaction = await arweave.createTransaction({
        target: address,
        quantity: arweave.ar.arToWinston(quantity as string),
      });
    }

    if (transaction) {
      const signedTransaction = await arweave.transactions.sign(
        transaction,
        key
      );
      return signedTransaction;
    }
  }

  if (input.transaction && input.key) {
    const signedTransaction = arweave.transactions.sign(
      input.transaction,
      input.key
    );
    return signedTransaction;
  }
}

export async function getTransactionStatus(transactionId: string) {
  const status = await arweave.transactions.getStatus(transactionId);

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
  const transaction = await arweave.transactions.get(input.transactionId);
  let txTags, txData;

  if (input.options?.tags) {
    txTags = transaction.tags.forEach((tag) => {
      let key = tag.get('name', { decode: true, string: true });
      let value = tag.get('value', { decode: true, string: true });

      return { key, value };
    });
  } else if (input.options?.data) {
    txData = await arweave.transactions.getData(input.transactionId);
  }

  return input.options?.data
    ? txData
    : input.options?.tags
    ? { transaction, tags: txTags }
    : input.options?.data && input.options?.tags
    ? { transactionData: txData, tags: txTags }
    : transaction;
}
