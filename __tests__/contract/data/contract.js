export function handle(state, action) {
  if (action.input === 'createPost') {
    state.posts.push({ name: 'Hello World', type: 'Blog Post' })
  }

  return { state };
}