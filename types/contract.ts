import { ArWallet, ContractData, ContractDeploy, CustomSignature } from 'warp-contracts';

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
