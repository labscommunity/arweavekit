import { Tag } from 'warp-contracts';

export const ARWEAVE_GATEWAYS = [
  'arweave.net',
  'arweave.dev',
  'g8way.io',
  'arweave-search.goldsky.com',
] as const;

export const appVersionTag = { name: 'ArweaveKit', value: '1.4.9' } as Tag;
