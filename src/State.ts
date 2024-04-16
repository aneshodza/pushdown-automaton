import TransitionFunction from "./TransitionFunction";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class State {
  name: string | null = null;
  transitionFunctions: Array<TransitionFunction> = [];

  constructor(name: string) {
    this.name = name;
    this.transitionFunctions = [];
  }

  addTransitionFunction(transitionFunction: TransitionFunction) {
    this.transitionFunctions.push(transitionFunction);
  }

  findTransitionFunction(input: string, stackPop: string) {
    return this.transitionFunctions.find((transitionFunction) => {
      return transitionFunction.checkForTransition(input, stackPop);
    });
  }

  allEpsilonTransitionFunctions(): Array<TransitionFunction> {
    return this.transitionFunctions.filter((transitionFunction) => {
      return transitionFunction.input === "";
    });
  }

  findEpsilonTransition(stackPop: string) {
    return this.findTransitionFunction("", stackPop);
  }
}

export default State;
