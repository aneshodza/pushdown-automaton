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
  transitionFunction = new TransitionFunction("a", otherState, "b", ["c", "d"]);
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

test("Transitions the stack correctly", () => {
  stack.push("b");
  transitionFunction.transition(stack, "a");
  expect(stack.stackValues).toEqual(["$", "c", "d"]);
});

test("Returns null if the input doesn't match", () => {
  stack.push("b");
  expect(transitionFunction.transition(stack, "b")).toBe(null);
});

test("Returns null if the stackPop doesn't match", () => {
  stack.push("a");
  expect(transitionFunction.transition(stack, "a")).toBe(null);
});
