import * as Types from '../types/wallet';
import { initArweave } from '../utils';
import { generateMnemonic, getKeyFromMnemonic } from 'arweave-mnemonic-keys';

/**
 * create wallet
 * @params seedPhrase: boolean (optional)
 * @params environment: 'local' | 'mainnet' (optional)
 * @returns walletAddress
 * @returns JWK
 * @returns seedPhrase if options.seedPhrase is passed in
 */

export async function createWallet(
  params: Types.CreateProps
): Promise<Types.CreateReturnProps> {
  const arweave = initArweave(params.environment);

  if (params?.seedPhrase) {
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
 * get wallet address for a private key
 * @params JWK / Private Key
 * @return address
 */
export async function getAddress(
  params: Types.GetAddressProps
): Promise<string> {
  const arweave = initArweave(params.environment);
  const address = await arweave.wallets.jwkToAddress(params.key);
  return address;
}

/**
 * get balance of wallet address
 * @params address: string
 * @params environment: 'local' | 'mainnet' (optional)
 * @returns walletBalance: string
 */

export async function getBalance(
  params: Types.GetBalanceProps
): Promise<string> {
  const arweave = initArweave(params.environment);
  const winstonBalance = await arweave.wallets.getBalance(params.address);

  const walletBalance = arweave.ar.winstonToAr(winstonBalance);

  return walletBalance;
}
