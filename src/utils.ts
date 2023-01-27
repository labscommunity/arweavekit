import ArLocal from 'arlocal';
import { writeFileSync } from 'fs';
import { exec } from 'child_process';
import { createWallet } from './common/wallet';

const port = 1986;
const arlocal = new ArLocal(port, false);

export const configTests = async () => {
  beforeAll(async () => {
    exec('npx arlocal', (err) => {
      if (err) {
        console.error(err);
      }
    });

    await arlocal.start();

    const testWallet = await createWallet({ seedPhrase: false });
    writeFileSync('./testWallet.json', JSON.stringify(testWallet));

  });

  afterAll(async () => {
    arlocal.stop();
    exec('killall node', (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};
