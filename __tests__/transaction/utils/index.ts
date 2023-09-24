import { readFileSync } from 'fs';
import { Tag } from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { createWallet } from '../../../src/lib/wallet';
import Arweave from 'arweave';

export function decodeTags(tags: Tag[]) {
  return tags.map(
    (tag) =>
      ({
        name: tag.get('name', { decode: true, string: true }),
        value: tag.get('value', { decode: true, string: true }),
      } as Tag)
  );
}

export async function getWallet(
  environment: 'local' | 'mainnet',
  isNew = false
) {
  let key: JWKInterface;
  try {
    // Needs to be a funded wallet.json if environment is 'mainnet'
    // Else error Txn headers undefined
    if (isNew) throw new Error('New wallet');
    key = JSON.parse(readFileSync('wallet.json').toString());
    if (environment === 'local') {
      const arweave = Arweave.init({
        host: 'localhost',
        port: 1984,
        protocol: 'http',
      });
      const walletAddress = await arweave.wallets.getAddress(key);
      await arweave.api
        .get(`mint/${walletAddress}/${arweave.ar.arToWinston('1')}`)
        .catch((error) => console.error(error));
    }
  } catch (e) {
    ({ key } = await createWallet({ environment }));
  }
  return key;
}

export async function getArweave(environment: 'local' | 'mainnet') {
  if (environment === 'local') {
    return Arweave.init({
      host: 'localhost',
      port: 1984,
      protocol: 'http',
    });
  }
  return Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });
}
