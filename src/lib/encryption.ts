import * as Types from '../types/encryption';

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
  await window.arweaveWallet.connect(['ENCRYPT']);

  const encryptedKey = await window.arweaveWallet.encrypt(params.key, {
    algorithm: 'RSA-OAEP',
    hash: 'SHA-256',
  });

  return encryptedKey;
}

export async function decryptAESKeywithRSA(
  params: Types.DecryptAESKeywithRSAProps
) {
  await window.arweaveWallet.connect(['ENCRYPT', 'DECRYPT']);

  const decryptedKey = await window.arweaveWallet.decrypt(params.key, {
    algorithm: 'RSA-OAEP',
    hash: 'SHA-256',
  });

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
