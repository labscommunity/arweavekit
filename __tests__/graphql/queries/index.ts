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
