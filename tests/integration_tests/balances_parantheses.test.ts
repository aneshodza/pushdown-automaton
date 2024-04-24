import PushdownAutomaton from "../../src/PushdownAutomaton";
import State from "../../src/State";
import Transition from "../../src/TransitionFunction";

/*
 * In this test a pushdown automaton that checks following language is tested:
 * L = { w | w contains balanced parentheses }
 */

let automaton: PushdownAutomaton;
beforeEach(() => {
  // Initialize the automaton
  automaton = new PushdownAutomaton();

  // Initialize the start and end states
  let startState = new State("q1");
  let endState = new State("q2");
  automaton.setStartSate(startState);
  automaton.addEndState(endState);

  // Add transition functions to start state
  let transition1 = new Transition("(", startState, "$", ["$", "L"]);
  startState.addTransitionFunction(transition1);
  let transition2 = new Transition("(", startState, "L", ["L", "1"]);
  startState.addTransitionFunction(transition2);
  let transition3 = new Transition("(", startState, "1", ["1", "1"]);
  startState.addTransitionFunction(transition3);
  let transition4 = new Transition(")", startState, "1", []);
  startState.addTransitionFunction(transition4);
  let transition5 = new Transition(")", endState, "L", []);
  startState.addTransitionFunction(transition5);

  // Add transition functions to end state
  let transition6 = new Transition("(", startState, "$", ["$", "L"]);
  endState.addTransitionFunction(transition6);
});

test("Balanced parentheses", () => {
  let result = automaton.run("(()())");

  expect(result.successful).toBe(true);
});

test("Unbalanced parentheses", () => {
  let result = automaton.run("(()()");
  expect(result.successful).toBe(false);
});

test("When starting with a bad character", () => {
  let result = automaton.run(")()()");
  expect(result.successful).toBe(false);
});
