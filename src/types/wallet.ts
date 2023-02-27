import { JWKInterface } from 'arweave/node/lib/wallet';

export interface CreateWalletProps {
  seedPhrase?: boolean;
  environment: 'testnet' | 'mainnet';
}
export interface CreateWalletReturnProps {
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
    winston?: boolean;
  };
}
