import { JWKInterface } from 'warp-contracts';
import * as Types from '../types/encryption';
import Arweave from 'arweave';

/**
 *  Get web crypto in node and browser environment
 * @returns web crypto
 */
async function getWebCrypto() {
  let webCrypto: Crypto;

  if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
    webCrypto = window.crypto;
  } else {
    try {
      const crypto = await import('crypto');
      webCrypto = crypto.webcrypto as Crypto;
    } catch (e) {
      throw new Error('Crypto API is not available.');
    }
  }
  return webCrypto;
}

/**
 * Check if the passed argument is a valid JSON Web Key (JWK) for Arweave.
 * @param obj - The object to check for JWK validity.
 * @returns {boolean} True if it's a valid Arweave JWK, otherwise false.
 */
const isJwk = (obj: any): boolean => {
  if (typeof obj !== 'object') return false;
  const requiredKeys = ['n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi'];
  return requiredKeys.every((key) => key in obj);
};

function initArweave() {
  const ArweaveClass: typeof Arweave = (Arweave as any)?.default ?? Arweave;
  const arweave = ArweaveClass.init({});
  return arweave;
}

/**
 * concatenateArrayBuffers
 * @param buffer1 random iv as ArrayBuffer
 * @param buffer2 encrypted data as ArrayBuffer
 * @returns concatenated ArrayBuffer with random iv and encrypted data
 * r
 */
function concatenateArrayBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
  let combinedBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  combinedBuffer.set(new Uint8Array(buffer1), 0);
  combinedBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);

  return combinedBuffer.buffer;
}

/**
 * separateArrayBuffer
 * @param combinedBuffer concatenated ArrayBuffer with random iv and encrypted data
 * @returns object containing separated random iv and encrypted data as ArrayBuffers
 */

function separateArrayBuffer(combinedBuffer: ArrayBuffer) {
  const prependArrayBuffer = combinedBuffer.slice(0, 12);
  const originalArrayBuffer = combinedBuffer.slice(12);
  const prependUint8Array = new Uint8Array(prependArrayBuffer);
  return {
    prependUint8Array,
    originalArrayBuffer,
  };
}

/**
 * bufferToBase64
 * @param buf AES encryption key as raw ArrayBuffer
 * @returns AES encryption key as base64 string
 */
function bufferToBase64(buf: ArrayBuffer) {
  var binstr = Array.prototype.map
    .call(new Uint8Array(buf), function (ch) {
      return String.fromCharCode(ch);
    })
    .join('');
  return Buffer.from(binstr, 'binary').toString('base64');
}

/**
 * encryptFileWithAES
 * @param params data (to be encrypted) as ArrayBuffer
 * @returns object of raw AES key as Base64 and encrypted data as ArrayBuffer
 */
export async function encryptDataWithAES(
  params: Types.EncryptDataWithAESProps
) {
  const webCrypto = await getWebCrypto();

  const encryptedDataAESKey = await webCrypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  const iv = webCrypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await webCrypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    encryptedDataAESKey,
    params.data
  );

  const combinedArrayBuffer = concatenateArrayBuffers(iv.buffer, encryptedData);

  const rawEncryptedKey = await webCrypto.subtle.exportKey(
    'raw',
    encryptedDataAESKey
  );

  const rawEncryptedKeyAsBase64 = bufferToBase64(rawEncryptedKey);

  return { rawEncryptedKeyAsBase64, combinedArrayBuffer };
}

/**
 * encryptAESKeywithRSA
 * @param params AES key as Base64 string
 * @returns RSA encrypted AES key as Uint8Array
 */
export async function encryptAESKeywithRSA(
  params: Types.EncryptAESKeywithRSAProps
) {
  let encryptedKey: Uint8Array;
  const salt = undefined;

  if (
    typeof window !== 'undefined' &&
    typeof window.arweaveWallet !== 'undefined' &&
    (!params.wallet || params.wallet === 'use_wallet')
  ) {
    const permissions = await window.arweaveWallet.getPermissions();
    if (permissions.indexOf('ENCRYPT') === -1) {
      await window.arweaveWallet.connect(['ENCRYPT']);
    }

    encryptedKey = await window.arweaveWallet.encrypt(params.key, {
      algorithm: 'RSA-OAEP',
      hash: 'SHA-256',
      salt,
    });
  } else {
    if (!params.wallet) {
      throw new Error('Wallet JWK not provided');
    }

    if (!isJwk(params.wallet)) {
      throw new Error('Wallet JWK invalid');
    }

    const webCrypto = await getWebCrypto();

    // get encryption key
    const encryptJwk = {
      kty: 'RSA',
      e: 'AQAB',
      n: (params.wallet as JWKInterface).n,
      alg: 'RSA-OAEP-256',
      ext: true,
    };

    const key = await webCrypto.subtle.importKey(
      'jwk',
      encryptJwk,
      {
        name: 'RSA-OAEP',
        hash: {
          name: 'SHA-256',
        },
      },
      false,
      ['encrypt']
    );

    // prepare data
    const dataBuf = new TextEncoder().encode(params.key + (salt || ''));

    const keyBuf = webCrypto.getRandomValues(new Uint8Array(256));

    // create arweave client
    const arweave = initArweave();

    // encrypt data
    const encryptedData = await arweave.crypto.encrypt(dataBuf, keyBuf);
    const encryptedKeyForData = await webCrypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      keyBuf
    );

    encryptedKey = arweave.utils.concatBuffers([
      encryptedKeyForData,
      encryptedData,
    ]);
  }

  return encryptedKey;
}

export async function decryptAESKeywithRSA(
  params: Types.DecryptAESKeywithRSAProps
) {
  let decryptedKey: string;
  const salt = undefined;

  if (
    typeof window !== 'undefined' &&
    typeof window.arweaveWallet !== 'undefined' &&
    (!params.wallet || params.wallet === 'use_wallet')
  ) {
    const permissions = await window.arweaveWallet.getPermissions();
    if (permissions.indexOf('DECRYPT') === -1) {
      await window.arweaveWallet.connect(['DECRYPT']);
    }

    decryptedKey = await window.arweaveWallet.decrypt(params.key, {
      algorithm: 'RSA-OAEP',
      hash: 'SHA-256',
      salt,
    });
  } else {
    if (!params.wallet) {
      throw new Error('Wallet JWK not provided');
    }

    if (!isJwk(params.wallet)) {
      throw new Error('Wallet JWK invalid');
    }

    const webCrypto = await getWebCrypto();

    // get decryption key
    const decryptJwk = {
      ...(params.wallet as JWKInterface),
      alg: 'RSA-OAEP-256',
      ext: true,
    };

    const key = await webCrypto.subtle.importKey(
      'jwk',
      decryptJwk,
      {
        name: 'RSA-OAEP',
        hash: {
          name: 'SHA-256',
        },
      },
      false,
      ['decrypt']
    );

    // prepare encrypted data
    const encryptedKey = new Uint8Array(
      new Uint8Array(Object.values(params.key)).slice(0, 512)
    );
    const encryptedData = new Uint8Array(
      new Uint8Array(Object.values(params.key)).slice(512)
    );

    // create arweave client
    const arweave = initArweave();

    // decrypt data
    const symmetricKey = await webCrypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      key,
      encryptedKey
    );

    const res = await arweave.crypto.decrypt(
      encryptedData,
      new Uint8Array(symmetricKey)
    );

    // if a salt is present, split it from the decrypted string
    if (salt) {
      return arweave.utils.bufferToString(res).split(salt)[0];
    }

    decryptedKey = arweave.utils.bufferToString(res);
  }

  return decryptedKey;
}

/**
 * base64ToBuffer
 * @param base64 raw AES key as base64 string
 * @returns raw AES key as ArrayBuffer
 */
function base64ToBuffer(base64: string) {
  var binstr = Buffer.from(base64, 'base64').toString('binary');
  var buf = new Uint8Array(binstr.length);
  Array.prototype.forEach.call(binstr, function (ch, i) {
    buf[i] = ch.charCodeAt(0);
  });
  return buf.buffer;
}

/**
 * decryptFileWithAES
 * @param params object of encrypted data as ArrayBuffer and raw AES key as base64 string
 * @returns decrypted data as ArrayBuffer
 */
export async function decryptDataWithAES(
  params: Types.DecryptDataWithAESProps
) {
  const webCrypto = await getWebCrypto();
  const ArrayBufferKey = base64ToBuffer(params.key);

  const decryptedKey = await webCrypto.subtle.importKey(
    'raw',
    ArrayBufferKey,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );

  const { prependUint8Array: iv, originalArrayBuffer: data } =
    separateArrayBuffer(params.data);

  const decryptedData = await webCrypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    decryptedKey,
    data
  );

  return decryptedData;
}
