export function handler(state, action) {
  if (action.input.function === 'createPost') {
    const posts = state.posts
    posts.push(action.input.post)

    return { state }
  }
}