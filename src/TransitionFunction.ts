import Stack from "./Stack";
import State from "./State";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TransitionFunction {
  input: string | null = null;
  nextState: State | null = null;
  stackPop: string | null = null;
  stackPush: Array<string> | null = null;

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

  checkForTransition(input: string, stackPop: string) {
    return (
      this.input === input && this.stackPop === stackPop
    );
  }
}

export default TransitionFunction;
