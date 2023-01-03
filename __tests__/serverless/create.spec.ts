import { createServerlessFunction } from '../../src/index';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

describe('Create Serverless Function', () => {
  it('should create serverless function', async () => {
    const token = process.env.TOKEN;
    const fnSrc = readFileSync('__tests__/serverless/data/contract.js');
    const initialState = '{ "posts": []}';

    const deploy = await createServerlessFunction({
      functionSource: fnSrc,
      initialState,
      token: token as string,
    });

    console.log(deploy);
  });
});
