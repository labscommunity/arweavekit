import { ArWallet, Contract } from 'warp-contracts';

export interface CreateContractProps {
  wallet: ArWallet | string;
  initialState: string;
  contractSource: string;
  environment: 'local' | 'testnet' | 'mainnet';
  strategy?: 'arweave' | 'ethereum' | 'both';
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
  wallet?: ArWallet | string;
  options: {};
  strategy?: 'arweave' | 'ethereum' | 'both';
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

export type PermissionType =
  | 'ACCESS_ADDRESS'
  | 'ACCESS_PUBLIC_KEY'
  | 'ACCESS_ALL_ADDRESSES'
  | 'SIGN_TRANSACTION'
  | 'ENCRYPT'
  | 'DECRYPT'
  | 'SIGNATURE'
  | 'ACCESS_ARWEAVE_CONFIG'
  | 'DISPATCH';
