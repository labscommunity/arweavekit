export async function handle(state, action) {
  if (action.input.function === 'createPost') {
    const posts = state.posts
    posts.push(action.input.post)
  }

  if (action.input.function === 'addTen') {
    state.counter = 10
  }

  return { state }
}