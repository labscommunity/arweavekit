import {
  ArWallet,
  Contract,
  CustomSignature,
  JWKInterface,
} from 'warp-contracts';

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
  wallet?: ArWallet | CustomSignature;
  options: {};
}

export interface ReadContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  contractTxId: string;
}

export interface WriteContractWOthentProps {
  apiId: string;
  othentFunction: string;
  data: {
    toContractId: string;
    toContractFunction: string;
    txnData: object;
  };
  tags?: {
    name: string;
    value: string;
  }[];
}

export interface WriteContractWOthentReturnProps {
  success: boolean;
  transactionId: string;
}

export interface ReadContractWOthentProps {
  apiId: string;
  contractTxId: string;
}

export interface ReadContractWOthentReturnProps {
  state: object;
  errors: object;
  validity: object;
}

export interface PluginType {
  name: string, 
  plugin: object 
}