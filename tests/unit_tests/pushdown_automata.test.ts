import PushdownAutomata from "../../src/PushdownAutomata";

let automata: PushdownAutomata;
beforeEach(() => {
  automata = new PushdownAutomata("test");
});

test("Initializes the automata with a stack", () => {
  expect(automata.stack).toBeDefined();
});

test("Takes in the correct input", () => {
  expect(automata.inputWord).toBe("test");
});
