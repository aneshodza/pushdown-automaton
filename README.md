# Pushdown Automaton
This package allows the user to create **deterministic** pushdown automata. If you need an explanation for what that is, you're in the wrong place.  
Maybe start by reading the [Wikipedia article](https://en.wikipedia.org/wiki/Pushdown_automaton).

---
**⚠️  ATTENTION  ⚠️**  
The Pushdown Automaton package currently only supports [deterministic automata](https://en.wikipedia.org/wiki/Deterministic_automaton). It currently checks following things:
- Two consecutive epsilon transitions
- Two matching transitions

It only checks for these two things on the node it's currently on (while being in the `run()`) so if for example node `q1` is not deterministic but the `run()` function doesn't reach `q1` it won't throw.

---

## Usage
**Important:** This just goes over creating an automaton using every configuration option. [Here](./tests/integration_tests/README.md) you can find real use-cases.
Creating a pushdown automaton involves following steps:
1. Creating the automaton instance
2. Creating all the states
3. Setting start and all end states

```javascript
/*
 * 0. Import everything you need
 */
import { PushdownAutomaton, State, TransitionFunction } from 'pushdown-automaton';

/*
 * 1. Instantiate the pushdown automaton with the input word
 * Provide a 2nd parameter to define the initial stack token.
 * Normally that's a dollar sign, but here I define it as %
 */
let automaton: PushdownAutomaton;
automaton = new PushdownAutomaton("test", "%");

/*
 * 2. Instantiate states and give them names
 */
let oneState: State;
oneState = new State("q0");
let otherState: State;
otherState = new State("q1");

/* 
 * 3. Instantiate transitions
 * First parameter is the token to be consumed
 * The second parameter is the state where the transition leads to
 * The third parameter shows the token to be popped off the stack
 * The fourth parameter is an array of things that will be pushed onto the stack
 */
let transitionFunction: Transition;
transitionFunction = new Transition("t", otherState, "$", ["c", "d"]);

/*
 * 4. Add the transition to it's origin
 */
oneState.addTransitionFunction(transitionFunction);

/*
 * 5. Set start state and add end state
 */
automaton.setStartSate(oneState);
automaton.addEndState(otherState);

/*
 * 6. Run the automaton and check it's return value
 */
let successful: boolean;
successful = automaton.run();

/*
 * 7. In case you want a function to run after every state change
 */
const someFunction = (automaton) => {
    // Do some stuff here
}
pushdownAutomaton.addOperation(someFunction);
```

#### Return values of `run()`
The `run()` Method makes use of the `TerminationMessage` interface, which looks as follows:
```javascript
interface TerminationMessage {
  reason: string;
  successful: boolean;
  code: number;
}
```
It holds a message, if it was sucessful and the return code. Following codes are possible:

| Code     | Meaning                                                              |
|:--------:|:---------------------------------------------------------------------|
|0         |Everything went okay. The machine terminated in a valid end state     |
|1         |The automaton didn't terminate in a valid end state                   |
|2         |The automaton didn't find a valid transition, so went to a sink state |
|Exception |The automaton isn't deterministic                                     |
|Exception |The input word is undefined                                           |


## Other links
- [Changelog](./docs/CHANGELOG.md)
- [Contributing](./docs/CONTRIBUTING.md)
- [Bugs](./docs/BUGS.md)
- [Feature requests](./docs/FEATURE_REQUESTS.md)

#### Credits
This library was written and published by [Anes Hodza](https://aneshodza.ch)
