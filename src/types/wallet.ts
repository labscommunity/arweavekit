import { JWKInterface } from "arweave/node/lib/wallet";

export interface CreateProps {
  seedPhrase: boolean;
}
export interface CreateReturnProps {
  key: JWKInterface;
  walletAddress: string;
  seedPhrase?: string;
}
