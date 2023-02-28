import Arweave from 'arweave';

export const initArweave = (env: 'local' | 'mainnet') => {
  let arweave;
  if (env === 'local') {
    arweave = Arweave.init({
      host: 'localhost',
      port: 1984,
      protocol: 'http',
    });
  } else {
    arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
  }

  return arweave;
};
