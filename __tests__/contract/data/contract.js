export function handle(state, action) {
  if (action.input.function === 'initialize') {
    state.counter = 10
  }
  if (action.input.function === 'fifty') {
    state.counter = 50
  }

  return { state }
}