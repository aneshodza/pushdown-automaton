import PushdownAutomata from "../../src/PushdownAutomata";
import State from "../../src/State";
import Transition from "../../src/TransitionFunction";

let automata: PushdownAutomata;
let oneState: State;
let otherState: State;
let transitionFunction: Transition;
beforeEach(() => {
  automata = new PushdownAutomata("test");
  oneState = new State("q0");
  otherState = new State("q1");
  transitionFunction = new Transition("t", otherState, "$", ["c", "d"]);

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
  expect(automata.step()).toStrictEqual({
    reason: "No epsilon transition found",
    sucessful: true,
    code: 0,
  });
  expect(automata.currentState).toBe(otherState);
});

test("Mutates the stack correctly", () => {
  automata.step();
  expect(automata.stack.stackValues).toStrictEqual(["c", "d"]);
});

test("Doesn't do anything if the transition isn't found", () => {
  automata.inputWord = "no_test";
  expect(automata.step()).toStrictEqual({
    reason: "No transition found",
    sucessful: false,
    code: 2,
  });
  expect(automata.currentState).toBe(oneState);
});

test("Runs epsilon transitions correctly", () => {
  let epsilonTransition = new Transition("", oneState, "d", ["c", "d"]);
  otherState.addTransitionFunction(epsilonTransition);

  automata.inputWord = "test";
  expect(automata.step()).toStrictEqual({
    reason: "Ran epsilon transition",
    sucessful: true,
    code: 0,
  });
  expect(automata.currentState).toBe(oneState);
})
