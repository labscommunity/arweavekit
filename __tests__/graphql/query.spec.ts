import { queryGQL, queryTransactionsGQL } from '../../src/lib/graphql';
import * as Types from '../../src/types/graphql';
import {
  transactionsQuery,
  transactionsWithPageInfo,
} from './queries';

describe('Query GraphQL endpoint with `queryGQL`', () => {
  it('should run and return first 10 transactions', async () => {
    const { data, errors, status } = await queryGQL(transactionsQuery, {
      gateway: 'arweave.dev',
      filters: {
        count: 10,
      },
    });

    expect(status).toBe(200);
    expect(data).not.toBeNull();
    expect(errors).toBeNull();
    expect(data?.transactions.edges.length).toBe(10);
  });

  it('should produce errors when invalid query is passed', async () => {
    const { data, errors, status } = await queryGQL(`invalid`, {
      gateway: 'arweave.dev',
      filters: {
        count: 5,
      },
    });

    expect(status).toBe(400);
    expect(data).toBeNull();
    expect(errors).not.toBeNull();
  });
});

describe('Query GraphQL endpoint with `queryTransactionsGQL`', () => {
  it('should get 5 transactions with cursor for pagniation', async () => {
    const { data, errors, status, cursor, hasNextPage } =
      await queryTransactionsGQL(transactionsWithPageInfo, {
        gateway: 'arweave.dev',
        filters: {
          count: 5,
          cursor: '',
        },
      });

    expect(status).toBe(200);
    expect(cursor).not.toBeNull();
    expect(data).not.toBeNull();
    expect(errors).toBeNull();

    expect(data.length).toBe(5);
    expect(hasNextPage).toBeTruthy();
  });

  it('should get 3 pages of transactions with 5 items per page', async () => {
    let LIMIT_PER_PAGE = 5;
    let page = 1;
    let numberOfPagesToGet = 3;

    const dataSets: Types.GQLEdge[][] = [];
    let cursor = '';
    let hasNextPage = true;

    while (page <= numberOfPagesToGet) {
      if (!hasNextPage) break;

      const {
        data,
        errors,
        cursor: currentCursor,
        hasNextPage: _hasNextPage,
      } = await queryTransactionsGQL(transactionsWithPageInfo, {
        gateway: 'arweave.dev',
        filters: {
          count: LIMIT_PER_PAGE,
          cursor,
        },
      });

      if (!errors) {
        dataSets.push(data);
        cursor = currentCursor;
        hasNextPage = _hasNextPage;
      }

      page++;
    }

    expect(dataSets.length).toBe(numberOfPagesToGet);
    expect(cursor).not.toBe('');

    const [firstPage, secondPage, thirdPage] = dataSets;

    expect(firstPage.length).toBe(5);
    expect(secondPage.length).toBe(5);
    expect(thirdPage.length).toBe(5);
  });

  it('should produce errors when invalid query is passed', async () => {
    const { data, errors, status } = await queryTransactionsGQL(`invalid`, {
      gateway: 'arweave.dev',
      filters: {
        count: 5,
      },
    });

    expect(status).toBe(400);
    expect(data).toEqual([]);
    expect(errors).not.toBeNull();
  });
});
