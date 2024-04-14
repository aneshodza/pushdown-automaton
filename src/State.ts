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

  findEpisilonTransitionfunction(stackPop: string) {
    return this.findTransitionfunction("", stackPop);
  }
}

