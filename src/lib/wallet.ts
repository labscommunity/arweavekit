import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { generateMnemonic, getKeyFromMnemonic } from 'arweave-mnemonic-keys';
import * as Types from '../types/wallet';

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http',
});

const arweaveMainnet = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

/**
 * create wallet
 * @params seedPhrase: boolean (optional)
 * @params environment: 'local' | 'mainnet' (optional)
 * @returns walletAddress
 * @returns JWK
 * @returns seedPhrase if options.seedPhrase is passed in
 */

export async function createWallet(
  params?: Types.CreateProps
): Promise<Types.CreateReturnProps> {
  let key: any;
  let walletAddress: string;

  if (params?.seedPhrase) {
    const seedPhrase = await generateMnemonic();

    if (seedPhrase) {
      key = await getKeyFromMnemonic(seedPhrase);
      walletAddress = await arweave.wallets.jwkToAddress(key);

      return {
        key,
        walletAddress,
        seedPhrase,
      };
    }
  }

  key = await arweave.wallets.generate();
  walletAddress = await arweave.wallets.jwkToAddress(key);

  if (params?.environment === 'local') {
    await arweave.api
      .get(`mint/${walletAddress}/1000000000000`)
      .catch((e: { message: any }) => 'Error, ' + e.message);
  }

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
export async function getAddress(key: JWKInterface): Promise<string> {
  const address = await arweave.wallets.jwkToAddress(key);
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
  let walletBalance: Promise<string>;

  if (params.environment === 'local') {
    walletBalance = arweave.wallets.getBalance(params.address);
    return walletBalance;
  }

  walletBalance = arweaveMainnet.wallets.getBalance(params.address);

  return walletBalance;
}
