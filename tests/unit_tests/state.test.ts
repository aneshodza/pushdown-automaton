import State from "../../src/State";
import Transition from "../../src/TransitionFunction";

let state: State;
let otherState: State;
let transitionFunction: Transition;
let epsilonTransitionFunction: Transition;
beforeEach(() => {
  state = new State("q0");
  otherState = new State("q1");
  transitionFunction = new Transition("a", otherState, "b", ["c"]);
  epsilonTransitionFunction = new Transition("", otherState, "b", [
    "c",
  ]);
});

test("Initializes the state with a name", () => {
  expect(state.name).toBe("q0");
});

test("Adds a transition function to the state", () => {
  state.addTransitionFunction(transitionFunction);
  expect(state.transitionFunctions).toContain(transitionFunction);
});

test("Finds a transition function by input and stackPop", () => {
  state.addTransitionFunction(transitionFunction);
  expect(state.findTransitionFunction("a", "b")).toBe(transitionFunction);
});

test("Gets all epsilon transitions", () => {
  state.addTransitionFunction(epsilonTransitionFunction);
  state.addTransitionFunction(transitionFunction);
  expect(state.allEpsilonTransitionFunctions()).toContain(epsilonTransitionFunction);
});

test("Gives empty array if no epsilon transitions", () => {
  state.addTransitionFunction(transitionFunction);
  expect(state.allEpsilonTransitionFunctions()).toEqual([]);
});

test("Finds an epsilon transition function by stackPop", () => {
  state.addTransitionFunction(epsilonTransitionFunction);
  expect(state.findEpsilonTransition("b")).toBe(
    epsilonTransitionFunction,
  );
});
