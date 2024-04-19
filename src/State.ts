import TransitionFunction from "./TransitionFunction";

/**
 * Represents a state within a pushdown automaton.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class State {
  name: string | null = null;
  transitionFunctions: Array<TransitionFunction> = [];

  /**
   * Initializes a new state with a name.
   * @param {string} name - The name of the state.
   */
  constructor(name: string) {
    this.name = name;
    this.transitionFunctions = [];
  }

  /**
   * Adds a transition function to this state.
   * @param {TransitionFunction} transitionFunction - The transition function to add.
   */
  addTransitionFunction(transitionFunction: TransitionFunction) {
    this.transitionFunctions.push(transitionFunction);
  }

  /**
   * Searches for a transition function based on input character and stack top.
   * @param {string} input - The input character.
   * @param {string} stackPop - The character at the top of the stack to be matched.
   * @returns {TransitionFunction|undefined} The matching transition function, or undefined if no match is found.
   */
  findTransitionFunction(
    input: string,
    stackPop: string,
  ): TransitionFunction | undefined {
    return this.allTransitionFunctions(input, stackPop)[0];
  }

  /**
   * Finds all matching transitions based on input character and stack top.
   * @param {string} input - The input character.
   * @param {string} stackPop - The character at the top of the stack to be matched.
   * @returns {Array<TransitionFunction>} An array of all matching transition functions.
   */
  allTransitionFunctions(
    input: string,
    stackPop: string,
  ): Array<TransitionFunction> {
    return this.transitionFunctions.filter((transitionFunction) => {
      return transitionFunction.checkForTransition(input, stackPop);
    });
  }

  /**
   * Retrieves all epsilon transition functions associated with this state.
   * @returns {Array<TransitionFunction>} An array of all epsilon transition functions.
   */
  allEpsilonTransitionFunctions(): Array<TransitionFunction> {
    return this.transitionFunctions.filter((transitionFunction) => {
      return transitionFunction.input === "";
    });
  }

  /**
   * Finds an epsilon transition based on the stack's top value.
   * @param {string} stackPop - The character at the top of the stack.
   * @returns {TransitionFunction|undefined} The epsilon transition function if found, otherwise undefined.
   */
  findEpsilonTransition(stackPop: string): TransitionFunction | undefined {
    return this.findTransitionFunction("", stackPop);
  }
}

export default State;
