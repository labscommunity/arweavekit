import {
  createServerlessFunction,
  writeServerlessFunction,
} from '../../src/index';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();
jest.setTimeout(12000);
const token = process.env.EXM_TOKEN as string;
const source = readFileSync('__tests__/serverless/data/contract.js');

describe('should write to serverless function', () => {
  it('should create new post', async () => {
    const initState = JSON.parse(
      readFileSync('__tests__/contract/data/state.json', 'utf-8')
    );

    const { functionId } = await createServerlessFunction({
      token: token,
      functionSource: source,
      initialState: initState,
    });

    const { status, data, state } = await writeServerlessFunction({
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

    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
    expect(data).toBeDefined();
    expect(status).toBe('SUCCESS');
    expect(typeof data).toBe('object');
    expect(data.execution.state).toBeDefined();
    expect(typeof data.execution.state).toBe('object');
  });
});
