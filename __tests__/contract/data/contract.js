export function handle(state, action) {
  if (action.input.function === 'initialize') {
    state.counter = 10;
  } else if (action.input.function === 'fifty') {
    state.counter = 50;
  } else if (action.input.function === 'random') {
    state.counter = SmartWeave.vrf.randomInt(100);
  }

  return { state };
}
