import Arweave from 'arweave';
import * as Types from '../types/wallet';
import { generateMnemonic, getKeyFromMnemonic } from 'arweave-mnemonic-keys';

const initArweave = (params: Types.InitArweaveProps) => {
  let arweave: Arweave;
  const ArweaveClass: typeof Arweave = (Arweave as any)?.default ?? Arweave;
  if (params.environment === 'local') {
    arweave = ArweaveClass.init({
      host: 'localhost',
      port: 1984,
      protocol: 'http',
    });
  } else {
    arweave = ArweaveClass.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
  }

  return arweave;
};

/**
 * create wallet
 * @params CreateWalletProps
 * @returns CreateWalletReturnProps
 */

export async function createWallet(
  params: Types.CreateWalletProps
): Promise<Types.CreateWalletReturnProps> {
  const arweave = initArweave({ environment: params.environment });

  if (params?.seedPhrase) {
    const seedPhrase = await generateMnemonic();

    if (seedPhrase) {
      const key = await getKeyFromMnemonic(seedPhrase);
      const walletAddress = await arweave.wallets.jwkToAddress(key);

      if (params.environment === 'local') {
        await arweave.api
          .get(`mint/${walletAddress}/1000000000000`)
          .catch((error) => console.error(error));
      }

      return {
        key,
        walletAddress,
        seedPhrase,
      };
    }
  }

  const key = await arweave.wallets.generate();
  const walletAddress = await arweave.wallets.jwkToAddress(key);

  if (params.environment === 'local') {
    await arweave.api
      .get(`mint/${walletAddress}/1000000000000`)
      .catch((error) => console.error(error));
  }

  return {
    key,
    walletAddress,
  };
}

/**
 * get wallet address for a private key
 * @params GetAddress Props
 * @return wallet address
 */
export async function getAddress(
  params: Types.GetAddressProps
): Promise<string> {
  const arweave = initArweave({ environment: params.environment });
  const address = await arweave.wallets.jwkToAddress(params.key);
  return address;
}

/**
 * get balance of wallet address
 * @params GetBalanceProps
 * @returns balance of given address in AR or Winston
 */

export async function getBalance(
  params: Types.GetBalanceProps
): Promise<string> {
  let walletBalance;
  const arweave = initArweave({ environment: params.environment });
  const winstonBalance = await arweave.wallets.getBalance(params.address);

  if (params.options?.winstonToAr) {
    walletBalance = arweave.ar.winstonToAr(winstonBalance);
    return walletBalance;
  } else {
    walletBalance = winstonBalance;
    return walletBalance;
  }
}
