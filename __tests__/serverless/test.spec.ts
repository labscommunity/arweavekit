import { readFileSync } from 'fs';
import { testServerlessFunction } from '../../src';
import { createWrite } from '../../src/lib/serverless';

const functionSrc = readFileSync('__tests__/serverless/data/contract.js');
const initState = {
  posts: [],
  counter: 0,
};

const data = {
  createPost: {
    input: {
      function: 'createPost',
      post: {
        title: 'Intro to arweave',
        author: 'Hans Zimmer',
      },
    },
  },

  addTen: {
    input: {
      function: 'addTen',
    },
  },
};

describe('TEST EXM', () => {
  it('should test creating post', async () => {
    const createPost = await testServerlessFunction({
      functionSource: functionSrc,
      functionInitState: initState,
      functionWrites: [createWrite(data.createPost.input)],
    });

    expect(createPost.state).toHaveProperty('posts');
    expect(createPost.state).toHaveProperty('counter');
    expect(createPost.state.counter).toBe(0);
    expect(createPost.state.posts.length).toBe(1);
  });

  it('should test incrementing counter', async () => {
    const addTen = await testServerlessFunction({
      functionSource: functionSrc,
      functionInitState: initState,
      functionWrites: [createWrite(data.addTen.input)],
    });

    expect(addTen.state.counter).toBe(10);
    expect(addTen.state.posts.length).toBe(0);
    expect(addTen.state).toHaveProperty('posts');
    expect(addTen.state).toHaveProperty('counter');
  });
});
