import * as pluginOne from './pluginOne';
import * as pluginTwo from './pluginTwo';
import { ArweaveKit } from '../../src/lib/wallet';

describe('Plugins', () => {
  it('should use plugins', () => {
    const arweaveKit = ArweaveKit.use({
      name: 'pluginOne',
      plugin: pluginOne,
    }).use({ name: 'pluginTwo', plugin: pluginTwo });

    expect(arweaveKit.pluginOne.hello()).toBe('PluginOne');
    expect(arweaveKit.pluginTwo.hello()).toBe('PluginTwo');
  });

  it('should throw error when same named plugins used', () => {
    try {
      const arweaveKit = ArweaveKit.use({
        name: 'pluginThree',
        plugin: pluginOne,
      }).use({ name: 'pluginThree', plugin: pluginTwo });

      // if not thrown error fail the test
      throw new Error('must throw error');
    } catch (error: any) {
      expect(error.message).toBe(
        'Plugin name already exists, please change plugin name.'
      );
    }
  });

  it('should throw error when empty name used for plugin', () => {
    try {
      const arweaveKit = ArweaveKit.use({
        name: '',
        plugin: pluginOne,
      });

      // if not thrown error fail the test
      throw new Error('must throw error');
    } catch (error: any) {
      expect(error.message).toBe('Please provide a valid plugin name.');
    }
  });

  it('should contain all functions with plugins', () => {
    const arweaveKit = ArweaveKit.use({
      name: 'pluginFour',
      plugin: pluginOne,
    });

    const functionNames = [
      'pluginFour',
      'initArweave',
      'createWallet',
      'getAddress',
      'getBalance',
    ];
    functionNames.forEach((functionName) => {
      expect(!!(arweaveKit as any)[functionName]).toBeTruthy();
    });
  });

  it('should be able to use wallet functions', async () => {
    const { key } = await ArweaveKit.createWallet({ environment: 'local' });
    const address = await ArweaveKit.getAddress({ environment: 'local', key });
    const balance = await ArweaveKit.getBalance({
      environment: 'local',
      address,
      options: { winstonToAr: true },
    });

    expect(key).toBeDefined();
    expect(address).toBeDefined();
    expect(parseFloat(balance)).toEqual(1.0);
  });
});
