import dotenv from 'dotenv';
import { createServerlessFunction, writeServerlessFunction } from '../../src';
import { readFileSync } from 'fs';

dotenv.config();
jest.setTimeout(12000);
const token = process.env.EXM_TOKEN as string;
const source = readFileSync('__tests__/serverless/data/contract.js');

describe('should write to serverless function', () => {
  it('should create new post', async () => {
    const initState = JSON.parse(
      readFileSync('__tests__/serverless/data/state.json', 'utf-8')
    );

    const { functionId } = await createServerlessFunction({
      token: token,
      functionSource: source,
      initialState: initState,
    });

    const { data, responseStatus } = await writeServerlessFunction({
      token,
      functionId,
      inputs: {
        function: 'createPost',
        post: {
          title: 'Intro to arweave',
          author: 'Hans Zimmer',
        },
      },
    });

    const expectedState = {
      posts: [{ title: 'Intro to arweave', author: 'Hans Zimmer' }],
    };

    expect(data).toBeDefined();
    expect(typeof data).toBe('object');
    expect(responseStatus.code).toBe(200);
    expect(responseStatus.message).toBe('SUCCESSFUL');
    expect(data.execution.state).toBeDefined();
    expect(typeof data.execution.state).toBe('object');
    expect(data.execution.state).toEqual(expectedState);
  });
});
