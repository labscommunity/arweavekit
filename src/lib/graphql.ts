import Arweave from 'arweave';
import { buildSchema, parse, validate, GraphQLError } from 'graphql';

import * as Types from '../types/graphql';
import { createArweaveKit, ARWEAVE_GATEWAYS } from '../utils';

/**
 * Query data with GraphQL endpoint
 * @params QueryGQLOptions
 * @returns QueryGQLResult
 */

export async function queryGQL(
  query: string,
  options: Types.QueryGQLOptions
): Promise<Types.QueryGQLResult> {
  let validationResult: GraphQLError[] = [];

  try {
    const queryAST = parse(query);
    const schema = buildSchema(graphQlSchemaString);
    const result = validate(schema, queryAST);

    validationResult = [...result];
  } catch (error: any) {
    validationResult.push(new GraphQLError(error.message));
  }

  if (validationResult.length > 0) {
    return {
      status: 400,
      data: null,
      errors: validationResult,
    };
  }

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

/**
 * Query transactions with pagination on GraphQL endpoint
 * @params QueryTransactionsGQLOptions
 * @returns QueryTransactionsGQLResult
 */

export async function queryTransactionsGQL(
  query: string,
  options: Types.QueryTransactionsGQLOptions
): Promise<Types.QueryTransactionsGQLResult> {
  let cursor = options.cursor || '';
  let hasNextPage = false;
  const filters = options.filters || {};

  const { data, errors, status } = await queryGQL(query, {
    ...options,
    filters: { ...filters, cursor },
  });

  const edges = data?.transactions?.edges || [];

  if (edges.length) {
    cursor = edges[edges.length - 1].cursor;
    hasNextPage = data?.transactions?.pageInfo?.hasNextPage || false;
  }

  return {
    status,
    data: edges,
    errors,
    cursor,
    hasNextPage,
  };
}

export async function queryAllTransactionsGQL(
  query: string,
  options: Types.QueryGQLOptions
) {
  const dataSet: Types.GQLEdge[] = [];

  let cursor = '';
  let hasNextPage = true;

  while (hasNextPage) {
    const {
      data,
      errors,
      cursor: currentCursor,
      hasNextPage: _hasNextPage,
    } = await queryTransactionsGQL(query, { ...options, cursor });

    if (errors && !data.length) {
      break;
    }

    dataSet.push(...data);
    cursor = currentCursor;
    hasNextPage = _hasNextPage;
  }

  return dataSet;
}

function initArweave(gateway: string): Arweave {
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

  const ArweaveClass: typeof Arweave = (Arweave as any)?.default ?? Arweave;
  const arweave = ArweaveClass.init(config);

  return arweave;
}

export const graphQlSchemaString = `
type Query {
  transaction(id: ID!): Transaction

  transactions(
    ids: [ID!]

    owners: [String!]

    recipients: [String!]

    tags: [TagFilter!]

    bundledIn: [ID!]

    block: BlockFilter

    first: Int = 10

    after: String

    sort: SortOrder = HEIGHT_DESC
  ): TransactionConnection!
  block(id: String): Block
  blocks(
    ids: [ID!]

    height: BlockFilter

    first: Int = 10

    after: String

    sort: SortOrder = HEIGHT_DESC
  ): BlockConnection!
}
type Owner {
  address: String!
  key: String!
}

type Amount {
  winston: String!
  ar: String!
}

type MetaData {
  size: String!
  type: String
}

type Tag {
  name: String!
  value: String!
}

# Block Schema
type Block {
  id: ID!
  timestamp: Int!
  height: Int!
  previous: ID!
}

type Parent {
  id: ID!
}

type Bundle {
  # ID of the containing data bundle.
  id: ID!
}

type Transaction {
  id: ID!
  anchor: String!
  signature: String!
  recipient: String!
  owner: Owner!
  fee: Amount!
  quantity: Amount!
  data: MetaData!
  tags: [Tag!]!

  block: Block

  parent: Parent @deprecated(reason: "Use 'bundledIn'")
  bundledIn: Bundle
}

type PageInfo {
  hasNextPage: Boolean!
}

type TransactionEdge {
  cursor: String!
  node: Transaction!
}

type TransactionConnection {
  pageInfo: PageInfo!
  edges: [TransactionEdge!]!
}

type BlockEdge {
  cursor: String!
  node: Block!
}

type BlockConnection {
  pageInfo: PageInfo!
  edges: [BlockEdge!]!
}

input TagFilter {
  name: String

  values: [String!]

  op: TagOperator = EQ

  match: TagMatch = EXACT
}

enum TagOperator {
  EQ

  NEQ
}

# The method used to determine if tags match.
enum TagMatch {
  EXACT
  WILDCARD
  FUZZY_AND
  FUZZY_OR
}

input BlockFilter {
  min: Int

  max: Int
}

enum SortOrder {
  HEIGHT_ASC
  HEIGHT_DESC
}
`;

export const ArweaveKit = createArweaveKit({
  queryGQL,
  queryTransactionsGQL,
  queryAllTransactionsGQL,
  ARWEAVE_GATEWAYS,
  graphQlSchemaString,
});
