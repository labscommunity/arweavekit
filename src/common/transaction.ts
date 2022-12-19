import arweave from '../utils';
import { SignTransactionProps } from '../types/transaction';

/**
 * sign transaction
 * @returns trasaction data
 */
export async function signTransaction(input: SignTransactionProps) {
  if (!input?.transaction && !input?.key) {
    // generate key
    const key = await arweave.wallets.generate();
    let transaction;

    // create data transaction
    if (input.options.type === 'data') {
      const { options } = input;
      transaction = await arweave.createTransaction(
        {
          data: options.data,
        },
        key
      );
    } else if (input.options.type === 'wallet') {
      // sign wallet to wallet transaction
      const { address, quantity } = input.options;
      transaction = await arweave.createTransaction({
        target: address,
        quantity: arweave.ar.arToWinston(quantity as string),
      });
    }

    // sign transaction
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
