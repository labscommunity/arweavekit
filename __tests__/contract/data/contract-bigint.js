BigInt.prototype.toJSON = function () {
  return this.toString();
};

export function handle(state, action) {
  if (action.input.function === 'initialize') {
    state.counter = BigInt(10);
  } else if (action.input.function === 'fifty') {
    state.counter = BigInt(50);
  } else if (action.input.function === 'random') {
    state.counter = BigInt(SmartWeave.vrf.randomInt(100));
  }

  return { state };
}
