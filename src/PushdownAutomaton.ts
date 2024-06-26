import Stack from "./Stack";
import State from "./State";
import TerminationMessage from "./TerminationMessage";

/**
 * Represents a pushdown automaton, a type of automaton that uses a stack to manage its operations.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PushdownAutomaton {
  stack: Stack;
  startState: State | null = null;
  endStates: Array<State> = [];

  currentState: State | null = null;
  inputWord: string | undefined;
  defaultStackTocken: string = "$";
  operation: ((automata: PushdownAutomaton) => void) | null = null;

  /**
   * Creates an instance of `PushdownAutomaton`.
   * @param {string} inputWord - The input word to be processed by the automaton.
   * @param {string} defaultStackTocken - The default token to be used as the initial value of the stack.
   */
  constructor(inputWord: string|undefined = undefined, defaultStackTocken: string = "$") {
    this.inputWord = inputWord;
    this.defaultStackTocken = defaultStackTocken;
    this.stack = new Stack(defaultStackTocken);
  }

  /**
   * Runs the automaton until the input word is fully processed or a failure occurs.
  * @param {string} inputWord - The input word to be processed by the automaton. If not provided, the input word must have been set previously.
   * @returns {TerminationMessage} An object describing the result of the execution.
   */
  run(inputWord: string|undefined = undefined): TerminationMessage {
    if (inputWord !== undefined) {
      this.inputWord = inputWord;
    } else if (this.inputWord === undefined) {
      throw new Error("No input word provided");
    }

    this.currentState = this.startState;
    this.stack = new Stack(this.defaultStackTocken);

    while (this.inputWord.length > 0) {
      const returnValue = this.step();

      this.operation?.call(this, this);
      if (!returnValue.successful) {
        return returnValue;
      }
    }

    if (this.endStates.includes(this.currentState!)) {
      return {
        reason: "Word accepted",
        successful: true,
        code: 0,
      };
    }
    return {
      reason: "Didn't end in an end state",
      successful: false,
      code: 1,
    };
  }

  /**
   * Executes a single step of the automaton using the current input character and stack state.
   * @returns {TerminationMessage} An object detailing the outcome of the step.
   */
  step(): TerminationMessage {
    const currentToken = this.inputWord!.charAt(0);
    this.inputWord = this.inputWord!.slice(1);

    if (
      this.currentState!.allTransitionFunctions(currentToken, this.stack.last())
        .length > 1
    ) {
      throw new Error("This is not a deterministic pushdown automata!");
    }

    const transition = this.currentState!.findTransitionFunction(
      currentToken,
      this.stack.last(),
    );

    if (transition === undefined) {
      return {
        reason: "No transition found",
        successful: false,
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
        successful: true,
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
      successful: true,
      code: 0,
    };
  }

  /**
   * Sets the start state of the automaton and initializes the current state to this start state.
   * @param {State} state - The start state of the automaton.
   */
  setStartSate(state: State) {
    this.startState = state;
    this.currentState = this.startState;
  }

  /**
   * Adds a state to the list of acceptable end states for the automaton.
   * @param {State} state - The state to add to the end states.
   */
  addEndState(state: State) {
    this.endStates.push(state);
  }

  /**
   * Generates a snapshot of the current state of the automaton, including state information and stack contents.
   */
  snapshot() {
    console.log(
      `Snapshot: \n` +
      `Current node: ${this.currentState!.name} \n\n` +
      `Stack: \n` +
      `${this.stack.stackClone().reverse().join("\n")}\n\n` +
      `Ugly stack [${this.stack.stackClone().join(", ")}]`,
    );
  }

  /**
   * Adds an operation to be executed during the automaton's run.
   * @param {(automata: PushdownAutomata) => void} operation - The operation to be added.
   */
  addOperation(operation: (automata: PushdownAutomaton) => void) {
    this.operation = operation;
  }
}

export default PushdownAutomaton;
