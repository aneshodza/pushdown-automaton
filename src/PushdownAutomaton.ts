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

    // Process initial epsilon transitions for empty input
    if (this.inputWord.length === 0) {
      const epsilonResult = this.processEpsilonTransitions();
      if (!epsilonResult.successful) {
        return epsilonResult;
      }
    }

    while (this.inputWord.length > 0) {
      const returnValue = this.step();

      this.operation?.call(this, this);
      if (!returnValue.successful) {
        return returnValue;
      }
    }

    // Process any remaining epsilon transitions after input is consumed
    const finalEpsilonResult = this.processEpsilonTransitions();
    if (!finalEpsilonResult.successful) {
      return finalEpsilonResult;
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
   * Processes epsilon transitions until no more are available
   * @returns {TerminationMessage} Result of epsilon transition processing
   */
  private processEpsilonTransitions(): TerminationMessage {
    let processedTransitions = 0;
    const maxTransitions = 100; // Prevent infinite loops

    while (processedTransitions < maxTransitions) {
      // Check if stack is empty - if so, no more epsilon transitions possible
      if (this.stack.stackClone().length === 0) {
        return {
          reason: "Stack is empty - no more epsilon transitions",
          successful: true,
          code: 0,
        };
      }

      const epsilonTransition = this.currentState!.findEpsilonTransition(
        this.stack.last()
      );

      if (epsilonTransition === undefined) {
        // No more epsilon transitions available
        return {
          reason: "No more epsilon transitions",
          successful: true,
          code: 0,
        };
      }

      // Check for determinism
      if (this.currentState!.allEpsilonTransitionFunctions().length > 1) {
        throw new Error("This is not a deterministic pushdown automata!");
      }

      epsilonTransition.transition(this.stack, "");
      this.currentState = epsilonTransition.nextState;
      processedTransitions++;
    }

    throw new Error("Too many epsilon transitions - possible infinite loop");
  }

  /**
   * Executes a single step of the automaton using the current input character and stack state.
   * @returns {TerminationMessage} An object detailing the outcome of the step.
   */
  step(): TerminationMessage {
    const currentToken = this.inputWord!.charAt(0);
    this.inputWord = this.inputWord!.slice(1);

    // Check if stack is empty - if so, can't process transitions that require stack access
    if (this.stack.stackClone().length === 0) {
      return {
        reason: "Stack is empty - no transitions possible",
        successful: false,
        code: 2,
      };
    }

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

    // Check if stack is empty after transition - if so, no epsilon transitions possible
    if (this.stack.stackClone().length === 0) {
      return {
        reason: "Stack is empty after transition",
        successful: true,
        code: 0,
      };
    }

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

  /**
   * Creates a PushdownAutomaton from a text-based mathematical definition
   * @param {string} definition - Text definition of the PDA using mathematical notation
   * @returns {PushdownAutomaton} A fully configured PushdownAutomaton instance
   * @example
   * ```
   * const definition = `
   *   States: q0, q1, q2
   *   Start State: q0
   *   Final States: q2
   *   Initial Stack Symbol: $
   *   δ(q0, a, $) = (q1, X$)
   *   δ(q1, b, X) = (q2, ε)
   * `;
   * const automaton = PushdownAutomaton.fromDefinition(definition);
   * ```
   */
  static fromDefinition(definition: string): PushdownAutomaton {
    // Import PDAParser dynamically to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PDAParser = require('./PDAParser').default;
    return PDAParser.parse(definition);
  }

  /**
   * Creates a PushdownAutomaton from a simple configuration object
   * @param {object} config - Simple configuration object
   * @returns {PushdownAutomaton} A fully configured PushdownAutomaton instance
   * @example
   * ```
   * const automaton = PushdownAutomaton.fromSimpleConfig({
   *   states: ['q0', 'q1', 'q2'],
   *   startState: 'q0',
   *   finalStates: ['q2'],
   *   transitions: [
   *     { from: 'q0', input: 'a', stackPop: '$', to: 'q1', stackPush: 'X$' },
   *     { from: 'q1', input: 'b', stackPop: 'X', to: 'q2', stackPush: '' }
   *   ]
   * });
   * ```
   */
  static fromSimpleConfig(config: {
    states: string[],
    startState: string,
    finalStates: string[],
    initialStackSymbol?: string,
    transitions: {
      from: string,
      input: string,
      stackPop: string,
      to: string,
      stackPush: string | string[]
    }[]
  }): PushdownAutomaton {
    // Import PDAParser dynamically to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PDAParser = require('./PDAParser').default;
    return PDAParser.fromSimpleConfig(config);
  }
}

export default PushdownAutomaton;
