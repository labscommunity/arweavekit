export interface EncryptDataWithAESProps {
  data: ArrayBuffer;
}

export interface EncryptAESKeywithRSAProps {
  key: string;
}

export interface DecryptAESKeywithRSAProps {
  key: Uint8Array;
}

export interface DecryptDataWithAESProps {
  data: ArrayBuffer;
  key: string;
}
