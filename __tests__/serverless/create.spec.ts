import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { createFunction } from '../../src';

dotenv.config();
const token = process.env.EXM_TOKEN;
const source = readFileSync('__tests__/serverless/data/contract.js');

describe('should create serverless function', () => {
  it('should read initial state from json file', async () => {
    const state = JSON.parse(
      readFileSync('__tests__/contract/data/state.json', 'utf-8')
    );

    const { functionId, functionSource, functionUrl, result } =
      await createFunction({
        token: token as string,
        functionSource: source,
        initialState: state,
      });

    expect(functionId).toBeDefined();
    expect(functionUrl).toBeDefined();
    expect(functionSource).toBeDefined();
    expect(typeof functionId).toBe('string');
    expect(typeof functionUrl).toBe('string');
    expect(typeof functionSource).toBe('string');
    expect(result.status).toBe(200);
    expect(result.statusText).toBe('SUCCESSFUL');
  });

  it('should read initial state from javascript object', async () => {
    const state = {
      counter: 0,
    };

    const { functionId, functionSource, functionUrl, result } =
      await createFunction({
        token: token as string,
        functionSource: source,
        initialState: state,
      });

    expect(functionId).toBeDefined();
    expect(functionUrl).toBeDefined();
    expect(functionSource).toBeDefined();
    expect(typeof functionId).toBe('string');
    expect(typeof functionUrl).toBe('string');
    expect(result.status).toBe(200);
    expect(result.statusText).toBe('SUCCESSFUL');
  });
});
