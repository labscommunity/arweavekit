import { ArWallet, ContractDeploy, CustomSignature } from 'warp-contracts';

interface ContractData {
  wallet: ArWallet;
  initialState: string;
  contractSource: string;
}

export interface CreateContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  contractData: ContractData;
}

export interface CreateContractReturnProps {
  contract: ContractDeploy;
  result: object;
}

export interface ReadContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  contractTxId: string;
  wallet: ArWallet | CustomSignature;
}

export interface WriteContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  contractTxId: string;
  wallet: ArWallet | CustomSignature;
  options: {};
}
