import { JWKInterface } from 'arweave/node/lib/wallet';

export interface CreateProps {
  seedPhrase?: boolean;
  environment: 'testnet' | 'mainnet';
}
export interface CreateReturnProps {
  key: JWKInterface;
  walletAddress: string;
  seedPhrase?: string;
}

export interface GetAddressProps {
  key: JWKInterface;
  environment: 'testnet' | 'mainnet';
}

export interface GetBalanceProps {
  address: string;
  environment: 'testnet' | 'mainnet';
  options?: {
    trim?: boolean;
    format?: boolean;
  };
}
