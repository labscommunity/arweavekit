import { encryptDataWithAES, decryptDataWithAES } from '../../src';

describe('Encryption AES', () => {
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

  it('should not encrypt and decrypt data when incorrect key provided', async () => {
    const dataToEncrypt = new TextEncoder().encode('Hello World!').buffer;

    const { rawEncryptedKeyAsBase64, combinedArrayBuffer } =
      await encryptDataWithAES({
        data: dataToEncrypt,
      });

    try {
      await decryptDataWithAES({
        data: combinedArrayBuffer,
        key: '',
      });

      // If the function doesn't throw an error, fail the test
      fail('Expected decryptDataWithAES to throw an error');
    } catch (err: any) {
      expect(err.message).toBe('Invalid key length');
    }
  });
});
