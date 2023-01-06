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
    signAndPost?: boolean;
  };
  key?: JWKInterface;
}

