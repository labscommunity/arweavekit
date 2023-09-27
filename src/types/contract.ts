import type {
  ArWallet,
  CacheOptions,
  Contract,
  EvaluationManifest,
  EvaluationOptions,
  Tags,
} from 'warp-contracts';

export type Environment = 'local' | 'testnet' | 'mainnet';

export interface CreateContractProps {
  wallet?: ArWallet | string;
  initialState: string;
  contractSource: string | Buffer;
  tags?: Tags;
  data?: {
    'Content-Type': string;
    body: string | Buffer;
  };
  evaluationManifest?: EvaluationManifest;
  environment: Environment;
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
  environment: Environment;
  contractTxId: string;
  wallet?: ArWallet | string;
  options: {};
  tags?: Tags;
  vrf?: boolean;
  evaluationOptions?: Partial<EvaluationOptions>;
  strategy?: 'arweave' | 'ethereum' | 'both';
  cacheOptions?: CacheOptions;
}

export interface ReadContractProps {
  environment: Environment;
  evaluationOptions?: Partial<EvaluationOptions>;
  contractTxId: string;
  cacheOptions?: CacheOptions;
}

export interface ViewContractProps {
  wallet?: ArWallet | string;
  environment: Environment;
  evaluationOptions?: Partial<EvaluationOptions>;
  contractTxId: string;
  cacheOptions?: CacheOptions;
  strategy?: 'arweave' | 'ethereum' | 'both';
  connectWallet?: boolean;
  options: {};
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

export type ContractProps =
  | CreateContractProps
  | WriteContractProps
  | ViewContractProps;

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
