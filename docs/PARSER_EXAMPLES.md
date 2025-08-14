# Text-Based PDA Parser Examples

This document demonstrates the new text-based parser for creating pushdown automata.

## Example 1: Using mathematical notation

```javascript
import { PushdownAutomaton } from 'pushdown-automaton';

const definition = `
  States: q0, q1, q2
  Start State: q0
  Final States: q2
  Initial Stack Symbol: $
  
  # Language: a^n b^n (n >= 1)
  δ(q0, a, $) = (q0, Z$)
  δ(q0, a, Z) = (q0, ZZ)
  δ(q0, b, Z) = (q1, ε)
  δ(q1, b, Z) = (q1, ε)
  δ(q1, ε, $) = (q2, $)
`;

const automaton = PushdownAutomaton.fromDefinition(definition);

console.log(automaton.run('ab').successful);    // true
console.log(automaton.run('aabb').successful);  // true
console.log(automaton.run('abc').successful);   // false
```

## Example 2: Using simple configuration

```javascript
import { PushdownAutomaton } from 'pushdown-automaton';

const automaton = PushdownAutomaton.fromSimpleConfig({
  states: ['q0', 'q1'],
  startState: 'q0',
  finalStates: ['q1'],
  transitions: [
    { from: 'q0', input: 'a', stackPop: '$', to: 'q1', stackPush: '' }
  ]
});

console.log(automaton.run('a').successful);   // true
console.log(automaton.run('b').successful);   // false
```

## Example 3: Balanced parentheses

```javascript
import { PDAParser } from 'pushdown-automaton';

const definition = `
  States: q0, q1
  Start State: q0
  Final States: q1
  Initial Stack Symbol: $
  
  # Transition to accept state when stack has only $
  δ(q0, ε, $) = (q1, $)
  
  # Push X for opening parenthesis
  δ(q0, (, $) = (q0, X$)
  δ(q0, (, X) = (q0, XX)
  
  # Pop X for closing parenthesis
  δ(q0, ), X) = (q0, ε)
  
  # From accept state, can start new sequence
  δ(q1, (, $) = (q0, X$)
`;

const automaton = PDAParser.parse(definition);

console.log(automaton.run('()').successful);     // true
console.log(automaton.run('()()').successful);   // true
console.log(automaton.run('(())').successful);   // true
console.log(automaton.run('(').successful);      // false
```

## Supported notation

- **States**: `States: q0, q1, q2`
- **Start State**: `Start State: q0`
- **Final States**: `Final States: q1, q2`
- **Initial Stack Symbol**: `Initial Stack Symbol: $`
- **Transitions**: `δ(state, input, stackPop) = (nextState, stackPush)`
- **Epsilon transitions**: Use `ε`, `epsilon`, or empty string
- **Comments**: Lines starting with `#`