import Arweave from 'arweave/node/common';

const arweave = new Arweave({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

export default arweave;
