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

  it('should not decrypt data when incorrect key provided', async () => {
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
      throw new Error('Expected decryptDataWithAES to throw an error');
    } catch (err: any) {
      expect(err.message).toBe('Invalid key length');
    }
  });

  it('should not decrypt data when incorrect encrypted data and key provided', async () => {
    const dataToEncryptOne = new TextEncoder().encode('Hello World One!');
    const dataToEncryptTwo = new TextEncoder().encode('Hello World Two!');

    const encryptedOne = await encryptDataWithAES({ data: dataToEncryptOne });
    const encryptedTwo = await encryptDataWithAES({ data: dataToEncryptTwo });

    try {
      await decryptDataWithAES({
        data: encryptedOne.combinedArrayBuffer,
        key: encryptedTwo.rawEncryptedKeyAsBase64,
      });

      // If the function doesn't throw an error, fail the test
      throw new Error('Expected decryptDataWithAES to throw an error');
    } catch (err: any) {
      expect(err.message).toBe(
        'The operation failed for an operation-specific reason'
      );
    }
  });
});
