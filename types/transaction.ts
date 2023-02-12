import BundlrTransaction from '@bundlr-network/client/build/common/transaction';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';

interface Tag {
  name: string;
  value: string;
}
export interface CreateTransactionProps {
  data?: string | Uint8Array | ArrayBuffer;
  quantity?: string;
  target?: string;
  options?: {
    tags?: Tag[];
    useBundlr?: boolean;
    signAndPost?: boolean;
    environment?: 'local' | 'mainnet';
  };
  key?: JWKInterface;
}

export interface SignTransactionProps {
  createdTransaction: Transaction | BundlrTransaction;
  key: JWKInterface;
  useBundlr?: boolean;
  postTransaction?: boolean;
  environment?: 'local' | 'mainnet';
}

export interface PostTransactionProps {
  transaction: Transaction | BundlrTransaction;
  key?: JWKInterface;
  useBundlr?: boolean;
  environment: 'local' | 'mainnet';
}

export interface GetTransactionData {
  transactionId: string;
  options?: {
    data?: boolean;
    tags?: boolean;
  };
}
