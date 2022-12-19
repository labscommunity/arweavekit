import { JWKInterface } from 'arweave/node/lib/wallet';

export interface BalanceProps {
  walletAddress: string;
}
export interface CreateProps {
  seedPhrase: boolean;
}
export interface CreateReturnProps {
  key: JWKInterface;
  walletAddress: string;
  seedPhrase?: string;
}
export interface BalanceProps {
  walletAddress: string;
}
