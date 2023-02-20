import { createFunction, readFunction, writeFunction } from '../../src/index';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();
jest.setTimeout(12000);
const token = process.env.EXM_TOKEN as string;
const source = readFileSync('__tests__/serverless/data/contract.js');

it('should read the state of function', async () => {
  const initState = JSON.parse(
    readFileSync('__tests__/serverless/data/state.json', 'utf-8')
  );

  const { functionId } = await createFunction({
    token: token,
    functionSource: source,
    initialState: initState,
  });

  const { result } = await writeFunction({
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

  if (result.status === 200 && result.statusText === 'SUCCESSFUL') {
    const state = await readFunction({
      token,
      functionId,
    });

    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
  }
});
