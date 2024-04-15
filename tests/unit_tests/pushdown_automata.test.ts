import PushdownAutomata from "../../src/PushdownAutomata";
import State from "../../src/State";
import TransitionFunction from "../../src/TransitionFunction";

let automata: PushdownAutomata;
let oneState: State;
let otherState: State;
let transitionFunction: TransitionFunction;
beforeEach(() => {
  automata = new PushdownAutomata("test");
  oneState = new State("q0");
  otherState = new State("q1");
  transitionFunction = new TransitionFunction("t", otherState, "$", ["c", "d"]);

  oneState.addTransitionFunction(transitionFunction);

  automata.setStartSate(oneState);
  automata.addEndState(otherState);
});

test("Initializes the automata with a stack", () => {
  expect(automata.stack).toBeDefined();
});

test("Takes in the correct input", () => {
  expect(automata.inputWord).toBe("test");
});

test("Trantisions correctly", () => {
  automata.step();

  expect(automata.currentState).toBe(otherState);
});

test("Mutates the stack correctly", () => {
  automata.step();
  expect(automata.stack.stackValues).toStrictEqual(["c", "d"]);
});
