BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function handle(state, action) {
  if (action.input.function === 'initialize') {
    state.counter = BigInt(10);
  } else if (action.input.function === 'fifty') {
    state.counter = BigInt(50);
  } else if (action.input.function === 'random') {
    state.counter = BigInt(SmartWeave.vrf.randomInt(100));
  } else if (action.input.function === 'internalWrite') {
    const result = await SmartWeave.contracts.write(action.input.contractId, {
      function: 'fifty',
    });

    state.counter = result.state.counter;
  } else if (action.input.function === 'counter') {
    return { state, result: state.counter };
  }

  return { state };
}
