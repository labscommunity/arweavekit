import { ConnectProps } from '../../types/auth';

export async function connect(params: ConnectProps) {
  return await window.arweaveWallet.connect(
    [...params.permissions],
    params.appInfo,
    params.gateway
  );
}

export async function disconnect() {
  return await window.arweaveWallet.disconnect();
}

export async function getActiveAddress() {
  return await window.arweaveWallet.getActiveAddress();
}

export async function getPermissions() {
  return await window.arweaveWallet.getPermissions();
}

export async function getWalletNames() {
  return await window.arweaveWallet.getWalletNames();
}

export async function getAllAddresses() {
  return await window.arweaveWallet.getAllAddresses();
}

export async function getActivePublicKey() {
  return await window.arweaveWallet.getActivePublicKey();
}

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

export const auth = {
  ArConnect: {
    connect,
    disconnect,
    getActiveAddress,
    getPermissions,
    getWalletNames,
    getAllAddresses,
    getActivePublicKey,
    isInstalled,
  },
};
