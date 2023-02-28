import BundlrTransaction from '@bundlr-network/client/build/common/transaction';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';

export interface CreateTransactionProps {
  type: 'data' | 'wallet';
  key?: JWKInterface;
  environment: 'local' | 'mainnet';
  target?: string;
  quantity?: string;
  data?: string | Uint8Array | ArrayBuffer;
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: boolean;
    signAndPost?: boolean;
  };
}

export interface SignTransactionProps {
  key: JWKInterface;
  environment: 'local' | 'mainnet';
  createdTransaction: Transaction | BundlrTransaction;
  useBundlr?: boolean;
  postTransaction?: boolean;
}

export interface PostTransactionProps {
  key: JWKInterface;
  environment: 'local' | 'mainnet';
  transaction: Transaction | BundlrTransaction;
  useBundlr?: boolean;
}

export interface GetTransactionProps {
  transactionId: string;
  environment: 'local' | 'mainnet';
  options?: {
    data?: boolean;
    tags?: boolean;
  };
}
