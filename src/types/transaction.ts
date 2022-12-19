import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';

export interface SignTransactionProps {
  transaction?: Transaction;
  key?: JWKInterface;
  options: {
    type: 'wallet' | 'data';
    data?: string | Uint8Array | ArrayBuffer;
    address?: string;
    quantity?: string;
  };
}
