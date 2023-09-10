import { JWKInterface } from 'warp-contracts';
import {
  encryptAESKeywithRSA,
  decryptAESKeywithRSA,
  createWallet,
} from '../../src/';

describe('Encryption RSA', () => {
  let wallet: JWKInterface;

  beforeAll(async () => {
    ({ key: wallet } = await createWallet({ environment: 'mainnet' }));
  });

  it('should encrypt and decrypt key', async () => {
    const keyToEncrypt = 'ArweaveKit';

    const encryptedKey = await encryptAESKeywithRSA({
      key: keyToEncrypt,
      wallet,
    });

    const decryptedKey = await decryptAESKeywithRSA({
      key: encryptedKey,
      wallet,
    });
    expect(keyToEncrypt).toBe(decryptedKey);
  });

  it('should throw error when wallet not provided to `encryptAESKeywithRSA`', async () => {
    const keyToEncrypt = 'ArweaveKit';
    try {
      await encryptAESKeywithRSA({
        key: keyToEncrypt,
      });

      // If the function doesn't throw an error, fail the test
      fail('Expected encryptAESKeywithRSA to throw an error');
    } catch (err: any) {
      expect(err.message).toBe('Wallet JWK not provided');
    }
  });

  it('should throw error when wallet not provided to `decryptAESKeywithRSA`', async () => {
    const keyToEncrypt = 'ArweaveKit';
    const encryptedKey = await encryptAESKeywithRSA({
      key: keyToEncrypt,
      wallet,
    });

    try {
      await decryptAESKeywithRSA({
        key: encryptedKey,
      });

      // If the function doesn't throw an error, fail the test
      fail('Expected decryptAESKeywithRSA to throw an error');
    } catch (err: any) {
      expect(err.message).toBe('Wallet JWK not provided');
    }
  });

  it('should throw error when invalid wallet provided to `encryptAESKeywithRSA`', async () => {
    const keyToEncrypt = 'ArweaveKit';
    try {
      await encryptAESKeywithRSA({
        key: keyToEncrypt,
        wallet: 'invalid' as unknown as JWKInterface,
      });

      // If the function doesn't throw an error, fail the test
      fail('Expected encryptAESKeywithRSA to throw an error');
    } catch (err: any) {
      expect(err.message).toBe('Wallet JWK invalid');
    }
  });

  it('should throw error when invalid wallet provided to `decryptAESKeywithRSA`', async () => {
    const keyToEncrypt = 'ArweaveKit';
    const encryptedKey = await encryptAESKeywithRSA({
      key: keyToEncrypt,
      wallet,
    });

    try {
      await decryptAESKeywithRSA({
        key: encryptedKey,
        wallet: 'invalid' as unknown as JWKInterface,
      });

      // If the function doesn't throw an error, fail the test
      fail('Expected decryptAESKeywithRSA to throw an error');
    } catch (err: any) {
      expect(err.message).toBe('Wallet JWK invalid');
    }
  });
});
