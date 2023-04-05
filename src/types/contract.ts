import { ArWallet, Contract } from 'warp-contracts';

export interface CreateContractProps {
  wallet: ArWallet;
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
  wallet: ArWallet;
  options: {};
}

export interface ReadContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  contractTxId: string;
  wallet: ArWallet;
}
