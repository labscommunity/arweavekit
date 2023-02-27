import Arweave from 'arweave';

export const initArweave = (env: 'testnet' | 'mainnet') => {
  let arweave;
  if (env === 'testnet') {
    arweave = Arweave.init({
      host: 'localhost',
      port: 1984,
      protocol: 'http',
    });
  }
  arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });

  return arweave;
};
