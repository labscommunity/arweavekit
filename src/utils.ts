import { Tag } from 'warp-contracts';

import { ArweaveKitType, PluginType } from './types/plugin';

export const ARWEAVE_GATEWAYS = [
  'arweave.net',
  'arweave.dev',
  'g8way.io',
  'arweave-search.goldsky.com',
] as const;

export const appVersionTag = {
  name: 'ArweaveKit',
  value: 'REPLACE-WITH-ARWEAVEKIT-VERSION',
} as Tag;

export const createArweaveKit = <T extends Record<string, any> = {}>(
  initialPlugins: T
): ArweaveKitType<T> => {
  const plugins: T = initialPlugins || ({} as T);

  const use = <K extends string, P>(
    params: PluginType<K, P>
  ): ArweaveKitType<T & Record<K, P>> => {
    if (!params.name) {
      throw new Error('Please provide a valid plugin name.');
    }

    if (plugins.hasOwnProperty(params.name)) {
      throw new Error('Plugin name already exists, please change plugin name.');
    }

    // @ts-ignore
    // Dynamically add the plugin property to the instance
    plugins[params.name] = params.plugin;

    // Return a new ArweaveKit with updated type information
    return createArweaveKit(plugins) as ArweaveKitType<T & Record<K, P>>;
  };

  return {
    use,
    ...plugins,
  } as ArweaveKitType<T>;
};
