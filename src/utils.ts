import { ArweaveKitType, PluginType } from './types/plugin';

export const ARWEAVE_GATEWAYS = [
  'arweave.net',
  'arweave.dev',
  'g8way.io',
  'arweave-search.goldsky.com',
] as const;

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
