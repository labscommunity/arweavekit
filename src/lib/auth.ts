import { ConnectProps, UserDetailsReturnProps } from '../types/auth';
import othent from 'othent';

/***
 * connect to arconnect wallet
 * @params ConnectProps
 */
export async function connect(params: ConnectProps) {
  return await window.arweaveWallet.connect(
    [...params.permissions],
    params.appInfo,
    params.gateway
  );
}

/***
 * disconnect arconnect wallet
 */
export async function disconnect() {
  return await window.arweaveWallet.disconnect();
}

/***
 * connect to arconnect wallet
 * @returns string
 */
export async function getActiveAddress() {
  return await window.arweaveWallet.getActiveAddress();
}

/***
 * get permissions current wallet
 */
export async function getPermissions() {
  return await window.arweaveWallet.getPermissions();
}

/***
 * get wallet names
 */
export async function getWalletNames() {
  return await window.arweaveWallet.getWalletNames();
}

/***
 * get all wallet addresses
 * @returns string[]
 */
export async function getAllAddresses() {
  return await window.arweaveWallet.getAllAddresses();
}

/***
 * get active public key
 * @returns string
 */
export async function getActivePublicKey() {
  return await window.arweaveWallet.getActivePublicKey();
}

/***
 * check if arconnect extenstion is installed
 * @returns boolean
 */
export async function isInstalled() {
  let arweaveWallet;

  const loadWallet = () => {
    arweaveWallet = window.arweaveWallet;
    return arweaveWallet;
  };

  if (window.arweaveWallet) {
    loadWallet();
  } else {
    addEventListener('arweaveWalletLoaded', loadWallet);
  }

  return arweaveWallet ? true : false;
}

/***
 * logIn using othent
 *
 */
export async function logIn() {
  const response = await othent.logIn();
  return response;
}

/***
 * logOut using othent
 *
 */
export async function logOut() {
  await othent.logOut();
}

/***
 * fetch userDetails using othent
 *
 */
export async function userDetails(): Promise<UserDetailsReturnProps> {
  const response = await othent.userDetails();
  return response;
}


export const ArConnect = {
  connect,
  disconnect,
  getActiveAddress,
  getPermissions,
  getWalletNames,
  getAllAddresses,
  getActivePublicKey,
  isInstalled,
};

export const Othent = {
  logIn,
  logOut,
  userDetails,
};
