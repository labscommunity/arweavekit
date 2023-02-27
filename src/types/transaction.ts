import BundlrTransaction from '@bundlr-network/client/build/common/transaction';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';

export interface CreateTransactionProps {
  key: JWKInterface;
  type: 'data' | 'wallet';
  environment: 'testnet' | 'mainnet';
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
  environment: 'testnet' | 'mainnet';
  createdTransaction: Transaction | BundlrTransaction;
  useBundlr?: boolean;
  postTransaction?: boolean;
}

export interface PostTransactionProps {
  key: JWKInterface;
  environment: 'testnet' | 'mainnet';
  transaction: Transaction | BundlrTransaction;
  useBundlr?: boolean;
}

export interface GetTransactionData {
  transactionId: string;
  environment: 'testnet' | 'mainnet';
  options?: {
    data?: boolean;
    tags?: boolean;
  };
}
