import Arweave from 'arweave';
import { generateMnemonic, getKeyFromMnemonic } from 'arweave-mnemonic-keys';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { CreateProps, CreateReturnProps, GetBalanceProps } from '../../types/wallet';

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
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
  params?: CreateProps,
): Promise<CreateReturnProps> {
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

  if (params?.environment == 'local') {
    await arweave.api.get(`mint/${walletAddress}/1000000000000`)
      .catch(e => console.log("Error", e.message));
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

export async function getBalance(params: GetBalanceProps): Promise<string> {
  if (params?.address.length === 0) {
    return 'Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).';
  }

  if (params?.address.length > 0 && params?.address.length < 43) {
    return 'Entered wallet address is less than 43 characters. Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).';
  }

  if (params.environment == 'local') {
    const walletBalance = arweave.wallets.getBalance(params.address);
    return walletBalance;
  }

  const walletBalance = arweaveMainnet.wallets.getBalance(params.address);

  return walletBalance;
}
