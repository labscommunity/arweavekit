import {
  encryptDataWithAES,
  decryptDataWithAES,
} from '../../src/lib/encryption';

describe('Encryption', () => {
  it('should encrypt and decrypt data', async () => {
    const dataToEncrypt = new TextEncoder().encode('Hello World!').buffer;

    const { rawEncryptedKeyAsBase64, combinedArrayBuffer } =
      await encryptDataWithAES({
        data: dataToEncrypt,
      });

    const decryptedData = await decryptDataWithAES({
      data: combinedArrayBuffer,
      key: rawEncryptedKeyAsBase64,
    });

    expect(dataToEncrypt).toStrictEqual(decryptedData);
  });
});
