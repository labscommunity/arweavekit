import {
  ArWallet,
  CacheOptions,
  Contract,
  EvaluationManifest,
  EvaluationOptions,
  Tags,
} from 'warp-contracts';

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
  tags?: Tags;
  vrf?: boolean;
  evaluationOptions?: Partial<EvaluationOptions>;
  strategy?: 'arweave' | 'ethereum' | 'both';
  cacheOptions?: CacheOptions;
}

export interface ReadContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  evaluationOptions?: Partial<EvaluationOptions>;
  contractTxId: string;
  cacheOptions?: CacheOptions;
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
