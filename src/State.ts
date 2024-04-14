import TransitionFunction from "./TransitionFunction";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class State {
  name: string | null = null;
  transitionFunctions: Array<TransitionFunction> = [];

  constructor(name: string) {
    this.name = name;
    this.transitionFunctions = [];
  }

  addUebergangsfunktion(uebergangsfunktion: TransitionFunction) {
    this.transitionFunctions.push(uebergangsfunktion);
  }

  findTransitionfunction(input: string, stackPop: string) {
    return this.transitionFunctions.find((transitionFunction) => {
      return transitionFunction.checkForTransition(input, stackPop);
    });
  }

  allEpisilonTransitions(): Array<TransitionFunction> {
    return this.transitionFunctions.filter((transitionFunction) => {
      return transitionFunction.input === "";
    });
  }

  findEpisilonTransitionfunction(stackPop: string) {
    return this.findTransitionfunction("", stackPop);
  }
}

export default State;
