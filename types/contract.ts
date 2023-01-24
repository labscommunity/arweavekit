import { ArWallet, Contract, ContractData, ContractDeploy } from 'warp-contracts';

export interface CreateContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  contractData: ContractData;
}

export interface CreateContractReturnProps {
  contract: ContractDeploy;
  result: object;
}

export interface ReadContractProps {
  contract: Contract;
}

export interface WriteContractProps {
  contract: Contract;
  options: {};
}
