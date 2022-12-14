import Arweave from 'arweave';
import { generateMnemonic, getKeyFromMnemonic } from 'arweave-mnemonic-keys';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { CreateProps, CreateReturnProps } from '../types/wallet';

const arweave = Arweave.init({
  host: '127.0.0.1',
  port: 8080,
  protocol: 'http',
});

/**
 * create wallet
 * @returns walletAddress, JWK, and seedPhrase if options.seedPhrase is passed in
 */

export async function createWallet(
  options: CreateProps
): Promise<CreateReturnProps> {
  if (options && options.seedPhrase) {
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
 * @return address
 */
export async function getAddress(key: JWKInterface): Promise<string> {
  if (!key) {
    return 'enter private key as argument';
  }

  const address = await arweave.wallets.jwkToAddress(key);
  return address;
}
