import { JWKInterface } from 'arweave/node/lib/wallet';

export interface CreateProps {
  seedPhrase?: boolean;
  environment?: 'local' | 'mainnet';
}
export interface CreateReturnProps {
  key: JWKInterface;
  walletAddress: string;
  seedPhrase?: string;
}
export interface GetBalanceProps {
  address: string;
  environment?: 'local' | 'mainnet';
}
