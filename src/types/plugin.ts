export interface PluginType<T, K> {
  name: T;
  plugin: K;
}

export type ArweaveKitType<T extends Record<string, any> = {}> = {
  use<K extends string, P>(
    params: PluginType<K, P>
  ): ArweaveKitType<T & Record<K, P>>;
} & T;
