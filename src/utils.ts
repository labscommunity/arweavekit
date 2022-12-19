import Arweave from 'arweave/node/common';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

export default arweave;
