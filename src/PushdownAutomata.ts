import Stack from "./Stack";
import State from "./State";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PushdownAutomata {
  states: Array<State> | null = [];
  stack: Stack = new Stack();
  startState: State | null = null;
  endStates: Array<State> = [];

  currentState: State | null = null;
  inputWord: string = "";

  delay: number = 0;

  constructor(inputWord: string, delay: number = 0) {
    this.inputWord = inputWord;
    this.delay = delay;
  }

  run(): boolean {
    while (this.inputWord.length > 0) {
      const success = this.step();

      if (this.delay === 0) {
        if (!success) {
          console.info("Went to trash state");
          return false;
        }
      } else {
        setTimeout(() => {
          if (!success) {
            console.info("Went to trash state");
            return;
          }
        }, this.delay);
      }
    }
    console.info("Terminated");

    if (this.endStates.includes(this.currentState!)) {
      console.info("Word accepted");
      return true;
    }
    return false;
  }

  step(): boolean {
    const currentToken = this.inputWord.charAt(0);
    this.inputWord = this.inputWord.slice(1);

    // Find the transition function that matches the current token
    const transitionFunction = this.currentState!.findTransitionfunction(
      currentToken,
      this.stack.last(),
    );

    // Check if a transition function was found and then proceed with the state transition
    if (transitionFunction === undefined) {
      console.log("No transition found!");
      return false;
    }

    transitionFunction.transition(this.stack, currentToken);
    this.currentState = transitionFunction.nextState;

    let epsilonTransitionFunction = this.currentState!
      .findEpisilonTransitionfunction(
        this.stack.last(),
      );

    if (epsilonTransitionFunction === undefined) {
      return true;
    }

    epsilonTransitionFunction.transition(this.stack, "");
    this.currentState = epsilonTransitionFunction.nextState;
    epsilonTransitionFunction = this.currentState!
      .findEpisilonTransitionfunction(
        this.stack.last(),
      );

    if (this.currentState!.allEpisilonTransitions().length > 0) {
      throw new Error("This is not a deterministic pushdown automata!");
    }

    return true;
  }

  addSate(state: State) {
    this.states!.push(state);
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
      `Current node: ${this.currentState?.name} \n\n` +
      `Stack: \n` +
      `${this.stack.stackClone().reverse().join("\n")}\n\n` +
      `Ugly stack [${this.stack.stackClone().reverse().join(", ")}]`,
    );
  }
}

export default PushdownAutomata;
