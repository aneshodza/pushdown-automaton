import PushdownAutomaton from "../../src/PushdownAutomaton";
import State from "../../src/State";
import Transition from "../../src/TransitionFunction";

let automata: PushdownAutomaton;
let oneState: State;
let otherState: State;
let transitionFunction: Transition;
beforeEach(() => {
  automata = new PushdownAutomaton("test");
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

test("Allows the initial stack character to be set", () => {
  automata = new PushdownAutomaton("test", "default");
  expect(automata.stack.stackValues).toStrictEqual(["default"]);
});

test("Takes in the correct input", () => {
  expect(automata.inputWord).toBe("test");
});

test("Trantisions correctly", () => {
  expect(automata.step()).toStrictEqual({
    reason: "No epsilon transition found",
    successful: true,
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
    successful: false,
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
    successful: true,
    code: 0,
  });
  expect(automata.currentState).toBe(oneState);
});

test("Correctly handles the whole word", () => {
  let transition5 = new Transition("", otherState, "e", ["d"]);
  let transition2 = new Transition("e", oneState, "d", ["d"]);
  let transition3 = new Transition("s", otherState, "d", ["d"]);
  let transition4 = new Transition("t", oneState, "d", ["e"]);

  otherState.addTransitionFunction(transition2);
  oneState.addTransitionFunction(transition3);
  otherState.addTransitionFunction(transition4);

  oneState.addTransitionFunction(transition5);

  expect(automata.run()).toStrictEqual({
    reason: "Word accepted",
    successful: true,
    code: 0,
  });
});

test("Corecctly realises if the word doesn't end in valid state", () => {
  let transition2 = new Transition("e", oneState, "d", ["d"]);
  let transition3 = new Transition("s", otherState, "d", ["d"]);
  let transition4 = new Transition("t", oneState, "d", ["e"]);

  otherState.addTransitionFunction(transition2);
  oneState.addTransitionFunction(transition3);
  otherState.addTransitionFunction(transition4);

  expect(automata.run()).toStrictEqual({
    reason: "Didn't end in an end state",
    successful: false,
    code: 1,
  });
});

test("If it doesn't find a transition", () => {
  let transition2 = new Transition("e", oneState, "d", ["d"]);
  let transition3 = new Transition("s", otherState, "d", ["d"]);

  otherState.addTransitionFunction(transition2);
  oneState.addTransitionFunction(transition3);

  expect(automata.run()).toStrictEqual({
    reason: "No transition found",
    successful: false,
    code: 2,
  });
});

test("If there are two consecutive epsilon transitions it throws that the pushdown automata is not deterministic", () => {
  let epsilonTransition = new Transition("", otherState, "d", ["c", "d"]);
  let epsilonTransition2 = new Transition("", oneState, "d", ["c", "d"]);
  otherState.addTransitionFunction(epsilonTransition);
  oneState.addTransitionFunction(epsilonTransition2);
  expect(() => automata.run()).toThrow(
    "This is not a deterministic pushdown automata!",
  );
});

test("Snapshot prints correctly", () => {
  let logSpy = jest.spyOn(console, "log");

  automata.snapshot();

  expect(logSpy).toHaveBeenCalledWith(
    `Snapshot: \n` +
    `Current node: ${automata.currentState?.name} \n\n` +
    `Stack: \n` +
    `${automata.stack.stackClone().reverse().join("\n")}\n\n` +
    `Ugly stack [${automata.stack.stackClone().reverse().join(", ")}]`,
  );

  logSpy.mockRestore();
});

test("Adds an operation and executes it", () => {
  let operation = jest.fn();
  automata.addOperation(operation);
  automata.run();
  expect(operation).toHaveBeenCalled();
  expect(operation).toHaveBeenCalledWith(automata);
});

test("Throws an exception if it finds two matching transitions", () => {
  let transition2 = new Transition("t", otherState, "$", ["c", "d"]);
  oneState.addTransitionFunction(transition2);
  expect(() => automata.run()).toThrow(
    "This is not a deterministic pushdown automata!",
  );
});

test("Allows the user to define a default stack token", () => {
  let automata = new PushdownAutomaton("test", "default");
  expect(automata.stack.stackValues).toStrictEqual(["default"]);
});

test("Allows creating an automaton without any input parameters", () => {
  automata = new PushdownAutomaton();
  expect(automata).toBeDefined();
  expect(automata.inputWord).toBeUndefined();
});

test("run() throws if no input word is provided", () => {
  automata = new PushdownAutomaton();
  expect(() => automata.run()).toThrow("No input word provided");
});

test("Allow run() to overwrite the input word", () => {
  automata.run("new word");
  expect(automata.inputWord).toBe("ew word");
});

test("run() in sucession works", () => {
  let transition5 = new Transition("", otherState, "e", ["d"]);
  let transition2 = new Transition("e", oneState, "d", ["d"]);
  let transition3 = new Transition("s", otherState, "d", ["d"]);
  let transition4 = new Transition("t", oneState, "d", ["e"]);

  otherState.addTransitionFunction(transition2);
  oneState.addTransitionFunction(transition3);
  otherState.addTransitionFunction(transition4);

  oneState.addTransitionFunction(transition5);

  automata.run();

  expect(automata.run("test")).toStrictEqual({
    reason: "Word accepted",
    successful: true,
    code: 0,
  });
});
