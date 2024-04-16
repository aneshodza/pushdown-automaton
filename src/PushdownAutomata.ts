import Stack from "./Stack";
import State from "./State";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PushdownAutomata {
  stack: Stack = new Stack();
  startState: State | null = null;
  endStates: Array<State> = [];

  currentState: State | null = null;
  inputWord: string = "";
  operation: ((automata: PushdownAutomata) => void) | null = null;

  constructor(inputWord: string) {
    this.inputWord = inputWord;
  }

  run(): TerminationMessage {
    while (this.inputWord.length > 0) {
      const returnValue = this.step();

      if (!returnValue.sucessful) {
        return returnValue;
      }

      this.operation?.call(this, this);
    }

    if (this.endStates.includes(this.currentState!)) {
      return {
        reason: "Word accepted",
        sucessful: true,
        code: 0,
      };
    }
    return {
      reason: "Didn't end in an end state",
      sucessful: false,
      code: 1,
    };
  }

  step(): TerminationMessage {
    const currentToken = this.inputWord.charAt(0);
    this.inputWord = this.inputWord.slice(1);

    const transition = this.currentState!.findTransitionFunction(
      currentToken,
      this.stack.last(),
    );

    if (transition === undefined) {
      return {
        reason: "No transition found",
        sucessful: false,
        code: 2,
      };
    }

    transition.transition(this.stack, currentToken);
    this.currentState = transition.nextState;

    const epsilonTransition = this.currentState!
      .findEpsilonTransition(
        this.stack.last(),
      );

    if (epsilonTransition === undefined) {
      return {
        reason: "No epsilon transition found",
        sucessful: true,
        code: 0,
      };
    }

    epsilonTransition.transition(this.stack, "");
    this.currentState = epsilonTransition.nextState;

    if (this.currentState!.allEpsilonTransitionFunctions().length > 0) {
      throw new Error("This is not a deterministic pushdown automata!");
    }

    return {
      reason: "Ran epsilon transition",
      sucessful: true,
      code: 0,
    };
  }

  setStartSate(state: State) {
    this.startState = state;
    this.currentState = this.startState;
  }

  addEndState(state: State) {
    this.endStates.push(state);
  }

  snapshot() {
    console.log(
      `Snapshot: \n` +
      `Current node: ${this.currentState!.name} \n\n` +
      `Stack: \n` +
      `${this.stack.stackClone().reverse().join("\n")}\n\n` +
      `Ugly stack [${this.stack.stackClone().reverse().join(", ")}]`,
    );
  }

  addOperation(operation: ((automata: PushdownAutomata) => void)) {
    this.operation = operation;
  }
}

export default PushdownAutomata;
