import ArLocal from 'arlocal';
import { createWallet, getBalance } from '../../src';

jest.setTimeout(120000);

describe('Get Balance', () => {
  it('should return undefined when wallet address is not passed in', async () => {
    const walletBalance = await getBalance({ address: '' });

    expect(walletBalance).toEqual(
      'Enter a valid wallet address as getBalance({ address: "WALLET_ADDRESS" }).'
    );
  });

  it('should return undefined when wallet address passed in is less than 43 characters', async () => {
    const walletBalance = await getBalance({
      address: 'y7sDPMTIcbvIWxSXSxrDvHldL',
    });

    expect(walletBalance).toEqual(
      'Entered wallet address is less than 43 characters. Enter a valid wallet address as getBalance({ address: "WALLET_ADDRESS" }).'
    );
  });

  it('should return a balance when wallet address is passed in', async () => {
    const { walletAddress } = await createWallet();
    const walletBalance = await getBalance({
      address: walletAddress,
    });

    expect(typeof parseInt(walletBalance)).toEqual('number');
    expect(parseInt(walletBalance)).toBeGreaterThan(0);
  });

  it('should return a balance when wallet address is passed in with local environment', async () => {
    const port = 1984;
    const arlocal = new ArLocal(port, false);
    await arlocal.start();
    const generateWallet = await createWallet({
      seedPhrase: false,
      environment: 'local',
    });
    const walletBalance = await getBalance({
      address: generateWallet.walletAddress,
      environment: 'local',
    });
    expect(typeof parseInt(walletBalance)).toEqual('number');
    expect(parseInt(walletBalance)).toEqual(1000000000000);
  });
});
