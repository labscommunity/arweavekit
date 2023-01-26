import { JWKInterface } from 'arweave/node/lib/wallet';

export interface CreateProps {
  options?: {
    seedPhrase: boolean;
    environment?: 'local' | 'mainnet';
  };
}
export interface CreateReturnProps {
  key: JWKInterface;
  walletAddress: string;
  seedPhrase?: string;
}
export interface GetBalanceProps {
  address: string;
  options?: {
    environment?: 'local' | 'mainnet';
  };
}
