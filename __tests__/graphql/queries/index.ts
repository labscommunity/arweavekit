export const transactionsQuery = `query($count: Int){
    transactions(
      first: $count
    ) {
      edges{
        cursor
        node {
          id
          owner {
            address
          }
          data {
            size
          }
          block {
            height
            timestamp
          }
          tags {
            name,
            value
          }
        }
      }
    }
  }`;

export const goldskyTransactionsQuery = `query($count: Int, $name: String, $values: [String!], $match: TagMatch){
    transactions(
      tags: [
        {name: $name, values: $values, match: $match}
      ]
      first: $count
    ) {
      edges{
        cursor
        node {
          id
          owner {
            address
          }
          data {
            size
          }
          block {
            height
            timestamp
          }
          tags {
            name,
            value
          }
        }
      }
    }
  }`;

export const transactionsWithTagFilterQuery = `query($count: Int $tags: [TagFilter!]){
    transactions(
      first: $count
      tags: $tags
    ) {
      edges{
        node {
          id
          owner {
            address
          }
          data {
            size
          }
          block {
            height
            timestamp
          }
          tags {
            name,
            value
          }
        }
      }
    }
  }`;

export const transactionsWithPageInfo = `query($count: Int $cursor: String){
    transactions(
      after: $cursor
      first: $count
    ) {
      pageInfo {
        hasNextPage
      }
      edges{
        cursor
        node {
          id
          owner {
            address
          }
          data {
            size
          }
          block {
            height
            timestamp
          }
          tags {
            name,
            value
          }
        }
      }
    }
  }`;

export const contractTransactionsWithPageInfo = `query($count: Int $cursor: String){
    transactions(
      after: $cursor
      first: $count
      tags: [{ name: "Contract", values: ["rK2BjT9OOFTut82rNZxu_D5RjwoMJCNgnnq1X0Z4ly0"] }]
    ) {
      pageInfo {
        hasNextPage
      }
      edges{
        cursor
        node {
          id
          owner {
            address
          }
          data {
            size
          }
          block {
            height
            timestamp
          }
          tags {
            name,
            value
          }
        }
      }
    }
  }`;
