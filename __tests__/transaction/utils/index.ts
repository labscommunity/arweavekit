import { readFileSync } from 'fs';
import { Tag } from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { createWallet } from '../../../src/lib/wallet';

export function decodeTags(tags: Tag[]) {
  return tags.map(
    (tag) =>
      ({
        name: tag.get('name', { decode: true, string: true }),
        value: tag.get('value', { decode: true, string: true }),
      } as Tag)
  );
}

export async function getWallet(environment: 'local' | 'mainnet') {
  let key: JWKInterface;
  try {
    // Needs to be a funded wallet.json if environment is 'mainnet'
    // Else error Txn headers undefined
    key = JSON.parse(readFileSync('wallet.json').toString());
  } catch (e) {
    ({ key } = await createWallet({ environment }));
  }
  return key;
}
