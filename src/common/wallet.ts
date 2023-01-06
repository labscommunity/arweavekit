import Arweave from 'arweave';
import { generateMnemonic, getKeyFromMnemonic } from 'arweave-mnemonic-keys';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { CreateProps, CreateReturnProps } from '../types/wallet';

const arweave = Arweave.init({
  host: '127.0.0.1',
  port: 8080,
  protocol: 'http',
});

const arweaveMainnet = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

/**
 * create wallet
 * @params options?: { seedPhrase: boolean }
 * @returns walletAddress, JWK, and seedPhrase if options.seedPhrase is passed in
 */

export async function createWallet(
  params?: CreateProps
): Promise<CreateReturnProps> {
  if (params?.options && params?.options.seedPhrase) {
    const seedPhrase = await generateMnemonic();

    if (seedPhrase) {
      const key = await getKeyFromMnemonic(seedPhrase);
      const walletAddress = await arweave.wallets.jwkToAddress(key);

      return {
        key,
        walletAddress,
        seedPhrase,
      };
    }
  }

  const key = await arweave.wallets.generate();
  const walletAddress = await arweave.wallets.jwkToAddress(key);

  return {
    key,
    walletAddress,
  };
}

/**
 * get wallet address for a provate key
 * @params JWK / Private Key
 * @return address
 */
export async function getAddress(key: JWKInterface): Promise<string> {
  const address = await arweave.wallets.jwkToAddress(key);
  return address;
}

/**
 * get balance of wallet address
 * @params address: string
 * @returns walletBalance: string
 */

export async function getBalance(address: string): Promise<string> {
  if (address.length === 0) {
    return 'Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).';
  }

  if (address.length > 0 && address.length < 43) {
    return 'Entered wallet address is less than 43 characters. Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).';
  }

  const walletBalance = arweaveMainnet.wallets.getBalance(address);

  return walletBalance;
}
