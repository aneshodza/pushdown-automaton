import Stack from "./Stack";
import State from "./State";

/**
 * Describes a transition function in a pushdown automaton, including conditions for the transition and state changes.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TransitionFunction {
  input: string | null = null;
  nextState: State | null = null;
  stackPop: string | null = null;
  stackPush: Array<string> | null = null;

  /**
   * Constructs a new transition function.
   * @param {string} input - The input character that triggers this transition.
   * @param {State} nextState - The state to transition into.
   * @param {string} stackPop - The stack character that needs to be popped for this transition.
   * @param {Array<string>} stackPush - The characters to be pushed onto the stack during this transition.
   */
  constructor(
    input: string,
    nextState: State,
    stackPop: string,
    stackPush: Array<string>,
  ) {
    this.input = input;
    this.nextState = nextState;
    this.stackPop = stackPop;
    this.stackPush = stackPush;
  }

  /**
   * Executes the transition on the provided stack with the current token.
   * @param {Stack} stack - The stack to operate on.
   * @param {string} currentToken - The current input token.
   * @returns {State|null} The next state after the transition, or null if the transition is not valid.
   */
  transition(stack: Stack, currentToken: string): State | null {
    if (currentToken !== this.input) {
      return null;
    }

    if (!stack.checkForValue(this.stackPop!)) {
      return null;
    }

    stack.pop();
    this.stackPush!.forEach((value) => {
      stack.push(value);
    });
    return this.nextState;
  }

  /**
   * Checks if the transition is applicable based on the input character and stack top character.
   * @param {string} input - The input character.
   * @param {string} stackPop - The stack top character that needs to be matched.
   * @returns {boolean} True if the transition conditions are met, otherwise false.
   */
  checkForTransition(input: string, stackPop: string): boolean {
    return (
      this.input === input && this.stackPop === stackPop
    );
  }
}

export default TransitionFunction;
