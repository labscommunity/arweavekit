import {
  BundlrTransaction,
  UploadResponse,
} from '@bundlr-network/client/build/esm/common/types';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';

export interface InitArweaveProps {
  environment: 'local' | 'mainnet';
}

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

export interface CreateWalletTransactionProps extends CreateTransactionProps {
  type: 'wallet';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: false;
    signAndPost?: false;
  };
}

export interface CreateAndPostWalletTransactionProps
  extends CreateTransactionProps {
  type: 'wallet';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: false;
    signAndPost?: true;
  };
}

export interface CreateDataTransactionProps extends CreateTransactionProps {
  type: 'data';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: false;
    signAndPost?: false;
  };
}

export interface CreateAndPostDataTransactionProps
  extends CreateTransactionProps {
  type: 'data';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: false;
    signAndPost?: true;
  };
}

export interface CreateBundledDataTransactionProps
  extends CreateTransactionProps {
  type: 'data';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: true;
    signAndPost?: false;
  };
}

export interface CreateAndPostBundledDataTransactionProps
  extends CreateTransactionProps {
  type: 'data';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: true;
    signAndPost?: true;
  };
}

export type CreateTransactionReturnProps<
  T extends
    | CreateWalletTransactionProps
    | CreateAndPostWalletTransactionProps
    | CreateDataTransactionProps
    | CreateAndPostDataTransactionProps
    | CreateBundledDataTransactionProps
    | CreateAndPostBundledDataTransactionProps
> = T extends CreateWalletTransactionProps
  ? Transaction
  : T extends CreateAndPostWalletTransactionProps
  ? {
      transaction: Transaction;
      postedTransaction: {
        status: number;
        statusText: string;
        data: any;
      };
    }
  : T extends CreateDataTransactionProps
  ? Transaction
  : T extends CreateAndPostDataTransactionProps
  ? {
      transaction: Transaction;
      postedTransaction: {
        status: number;
        statusText: string;
        data: any;
      };
    }
  : T extends CreateBundledDataTransactionProps
  ? BundlrTransaction
  : T extends CreateAndPostBundledDataTransactionProps
  ? {
      transaction: BundlrTransaction | Transaction;
      postedTransaction: any;
    }
  : never;

export interface SignTransactionProps {
  key?: JWKInterface;
  environment: 'local' | 'mainnet';
  createdTransaction: Transaction;
  postTransaction?: boolean;
}

export interface PostTransactionProps {
  key?: JWKInterface;
  environment: 'local' | 'mainnet';
  transaction: Transaction;
}

export interface GetTransactionProps {
  transactionId: string;
  environment: 'local' | 'mainnet';
}

export interface CreateandPostTransactionWOthentProps {
  apiId: string;
  othentFunction: string;
  data: File;
  tags?: {
    name: string;
    value: string;
  }[];
  useBundlr?: boolean;
}

export interface CreateandPostTransactionWOthentReturnProps {
  success: boolean;
  transactionId: string;
}

export interface TransactionData {
  data: string | Blob;
}
