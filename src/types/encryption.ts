export interface EncryptFileWithAESProps {
  data: ArrayBuffer;
}

export interface EncryptAESKeywithRSAProps {
  key: string;
}

export interface DecryptAESKeywithRSAProps {
  key: Uint8Array;
}

export interface DecryptFileWithAESProps {
  data: ArrayBuffer;
  key: string;
}
