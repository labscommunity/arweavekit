import Arweave from 'arweave';

import * as Types from '../types/graphql';
import { ARWEAVE_GATEWAYS } from '../utils';

/**
 * Query data with GraphQL endpoint
 * @params QueryGQLOptions
 * @returns QueryGQLResult
 */

export async function queryGQL(
  query: string,
  options: Types.QueryGQLOptions
): Promise<Types.QueryGQLResult> {
  const arweave = initArweave(options.gateway);

  const payload = {
    query,
    variables: options.filters,
  };
  const results = await arweave.api.post<Types.GQLResult>('/graphql', payload);

  return {
    status: results.status,
    data: results.data.data ?? null,
    errors: results.data.errors ?? null,
  };
}

function initArweave(gateway: string) {
  const LOCAL_GATEWAY_CONFIG = {
    host: 'localhost',
    port: 1984,
    protocol: 'http',
  };
  const MAINNET_GATEWAY_CONFIG = {
    host: gateway || ARWEAVE_GATEWAYS[0],
    port: 443,
    protocol: 'https',
  };

  let config = MAINNET_GATEWAY_CONFIG;

  if (gateway.indexOf('localhost') > -1) {
    config = LOCAL_GATEWAY_CONFIG;
  }

  return Arweave.init(config);
}
