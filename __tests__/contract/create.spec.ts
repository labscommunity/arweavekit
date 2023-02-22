import { readFileSync } from 'fs';
import { SrcCache } from 'warp-contracts';
import { createContract, createWallet } from '../../src/index';

// Please note that wallet1.json is an empty pre-created wallet stored in the root dir (not pushed to github)
// Please note that wallet2.json is a pre-funded pre-created wallet stored in the root dir (not pushed to github)

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

describe('Create Contract', () => {
  it('should create a new contract with wallet passed in on testnet', async () => {
    const wallet = JSON.parse(readFileSync('wallet2.json', 'utf-8'));

    const { contract, status } = await createContract({
      environment: 'testnet',
      wallet: wallet,
      initialState: initState,
      contractSource: contractSrc,
    });

    expect(contract).toBeDefined();
    expect(typeof contract).toEqual('object');
    expect(status).toBeDefined();
    expect(typeof status).toEqual('object');
    expect(status).toEqual({ code: 200, message: 'SUCCESSFUL' });
  });

  it('should create a new contract with wallet passed in on localhost', async () => {
    const { key } = await createWallet({ environment: 'local' });

    const { contract, status } = await createContract({
      environment: 'local',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    expect(contract).toBeDefined();
    expect(typeof contract).toEqual('object');
    expect(status).toBeDefined();
    expect(typeof status).toEqual('object');
    expect(status).toEqual({ code: 200, message: 'SUCCESSFUL' });
  });
});
