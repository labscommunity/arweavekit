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
    signAndPostTxn?: boolean;
  };
  key?: JWKInterface;
}
// export interface CreateTransactionReturnProps {
//   format: number;
//   id: string,
//   last_tx: string;
//   owner: string;
//   tags: Tag[];
//   target: string;
//   quantity: string;
//   data: string | Uint8Array | ArrayBuffer;
//   data_size: string;
//   data_root: string;
//   data_tree: [];
//   reward: string;
//   signature: string;
// }
