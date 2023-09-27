export function handle(state, action) {
  if (action.input.function === 'initialize') {
    state.counter = 10;
  } else if (action.input.function === 'fifty') {
    state.counter = 50;
  } else if (action.input.function === 'random') {
    state.counter = SmartWeave.vrf.randomInt(100);
  } else if (action.input.function === 'updateCreator') {
    if (action.caller) {
      state.creator = action.caller;
    }
  } else if (action.input.function === 'getCreator') {
    return { state, result: state.creator };
  } else if (action.input.function === 'getCaller') {
    return { state, result: action.caller };
  } else {
    throw new ContractError('Function not found');
  }

  return { state };
}
