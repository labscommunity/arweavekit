import { createContract, createWallet } from '../../src/index';
import { configTests } from '../../src/utils';
import { readFileSync } from 'fs';
import ArLocal from 'arlocal';

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

describe('Create Contract', () => {

  it('should create a new contract with wallet passed in on testnet', async () => {
    const wallet = JSON.parse(readFileSync('wallet2.json', 'utf-8'));

    const { contract, result } = await createContract({
      environment: 'testnet',
      contractData: {
        wallet: wallet,
        initState: initState,
        src: contractSrc,
      }
    });

    expect(contract).toBeDefined();
    expect(typeof contract).toEqual("object");
    expect(result).toBeDefined();
    expect(typeof result).toEqual("object");
    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });
  });

  it('should create a new contract with wallet passed in on localhost', async () => {
    const port = 1984;
    const arlocal = new ArLocal(port, false);

    await arlocal.start();
    const { key } = await createWallet({ environment: 'local' });

    const { contract, result } = await createContract({
      environment: 'local',
      contractData: {
        wallet: key,
        initState: initState,
        src: contractSrc,
      }
    });

    expect(contract).toBeDefined();
    expect(typeof contract).toEqual("object");
    expect(result).toBeDefined();
    expect(typeof result).toEqual("object");
    expect(result).toEqual({ status: 200, statusText: 'SUCCESSFUL' });

    arlocal.stop();
  });
});
