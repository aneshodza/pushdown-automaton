import State from "../../src/State";
import TransitionFunction from "../../src/TransitionFunction";
import Stack from "../../src/Stack";

let stack: Stack;
let otherState: State;
let transitionFunction: TransitionFunction;
let epsilonTransitionFunction: TransitionFunction;
beforeEach(() => {
  stack = new Stack();
  otherState = new State("q1");
  transitionFunction = new TransitionFunction("a", otherState, "b", ["c"]);
  epsilonTransitionFunction = new TransitionFunction("", otherState, "b", [
    "c",
  ]);
});

test("Initializes the transition with correct operations", () => {
  expect(transitionFunction.input).toBe("a");
  expect(transitionFunction.nextState).toBe(otherState);
  expect(transitionFunction.stackPop).toBe("b");
  expect(transitionFunction.stackPush).toContain("c");
});
