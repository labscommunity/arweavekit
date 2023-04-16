import { ArWallet, Contract, CustomSignature, JWKInterface } from 'warp-contracts';

export interface CreateContractProps {
  wallet: JWKInterface;
  initialState: string;
  contractSource: string;
  environment: 'local' | 'testnet' | 'mainnet';
}

export interface CreateContractReturnProps {
  result: {
    status: number;
    statusText: string;
  };
  contractTxId: string;
  contract: Contract;
}

export interface WriteContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  contractTxId: string;
  wallet: ArWallet | CustomSignature;
  options: {};
}

export interface ReadContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  contractTxId: string;
  wallet: ArWallet | CustomSignature;
}
