import { JWKInterface } from 'arweave/node/lib/wallet';

export interface CreateProps {
  options?: {
    seedPhrase: boolean;
  };
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
