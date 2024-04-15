import State from "../../src/State";
import TransitionFunction from "../../src/TransitionFunction";

let state: State;
let otherState: State;
let transitionFunction: TransitionFunction;
let epsilonTransitionFunction: TransitionFunction;
beforeEach(() => {
  state = new State("q0");
  otherState = new State("q1");
  transitionFunction = new TransitionFunction("a", otherState, "b", ["c"]);
  epsilonTransitionFunction = new TransitionFunction("", otherState, "b", [
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
  expect(state.allEpisilonTransitions()).toContain(epsilonTransitionFunction);
});

test("Gives empty array if no epsilon transitions", () => {
  state.addTransitionFunction(transitionFunction);
  expect(state.allEpisilonTransitions()).toEqual([]);
});

test("Finds an epsilon transition function by stackPop", () => {
  state.addTransitionFunction(epsilonTransitionFunction);
  expect(state.findEpisilonTransitionfunction("b")).toBe(
    epsilonTransitionFunction,
  );
});
