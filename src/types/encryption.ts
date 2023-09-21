import { ArWallet } from 'warp-contracts';

export interface EncryptDataWithAESProps {
  data: ArrayBuffer;
}

export interface EncryptAESKeywithRSAProps {
  key: string;
  wallet?: ArWallet;
}

export interface DecryptAESKeywithRSAProps {
  key: Uint8Array;
  wallet?: ArWallet;
}

export interface DecryptDataWithAESProps {
  data: ArrayBuffer;
  key: string;
}
