import { JWKInterface } from 'arweave/node/lib/wallet';

export interface CreateWalletProps {
  seedPhrase?: boolean;
  environment: 'local' | 'mainnet';
}
export interface CreateWalletReturnProps {
  key: JWKInterface;
  walletAddress: string;
  seedPhrase?: string;
}

export interface GetAddressProps {
  key: JWKInterface;
  environment: 'local' | 'mainnet';
}

export interface GetBalanceProps {
  address: string;
  environment: 'local' | 'mainnet';
  options?: {
    winston?: boolean;
  };
}
