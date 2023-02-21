import { ArWallet, Contract } from 'warp-contracts';

export interface CreateProps {
  wallet: ArWallet;
  initialState: string;
  contractSource: string;
  environment: 'local' | 'testnet' | 'mainnet';
}

export interface CreateReturnProps {
  status: {
    code: number;
    message: string;
  };
  contractTxId: string;
  contract: Contract;
}
