import { ArWallet, Contract, CustomSignature } from 'warp-contracts';

export interface CreateContractProps {
  wallet: ArWallet;
  initialState: string;
  contractSource: string;
  environment: 'local' | 'testnet' | 'mainnet';
}

export interface CreateContractReturnProps {
  status: {
    code: number;
    message: string;
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
