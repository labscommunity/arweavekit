import Transaction from "arweave/node/lib/transaction";
import { JWKInterface } from "arweave/node/lib/wallet";

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
    signAndPostTransaction?: boolean;
  };
  key?: JWKInterface;
}

export interface SignTransactionProps {
  transaction?: any;
  key?: JWKInterface;
  useBundlr?: boolean;
  postTransaction?: boolean;
}

export interface PostTransactionProps {
  transaction?: any;
  useBundlr?: boolean;
}

