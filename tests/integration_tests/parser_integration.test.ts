import PDAParser from '../../src/PDAParser';
import PushdownAutomaton from '../../src/PushdownAutomaton';

describe('PDA Parser Integration Tests', () => {
  describe('Balanced Parentheses using Parser', () => {
    test('should create balanced parentheses PDA from text definition', () => {
      const definition = `
        # Balanced parentheses language: L = { w | w contains balanced parentheses }
        States: q0, q1
        Input Alphabet: (, )
        Stack Alphabet: $, X
        Start State: q0
        Final States: q1
        Initial Stack Symbol: $
        
        # From start state with empty stack, go to accept state
        δ(q0, ε, $) = (q1, $)
        
        # From start state, push X for opening parenthesis
        δ(q0, (, $) = (q0, X$)
        δ(q0, (, X) = (q0, XX)
        
        # Pop X for closing parenthesis
        δ(q0, ), X) = (q0, ε)
        
        # From accept state, can start a new balanced sequence
        δ(q1, (, $) = (q0, X$)
      `;

      const automaton = PDAParser.parse(definition);

      // Test balanced parentheses
      expect(automaton.run('()').successful).toBe(true);
      expect(automaton.run('(())').successful).toBe(true);
      expect(automaton.run('()()').successful).toBe(true);
      expect(automaton.run('((()))').successful).toBe(true);

      // Test unbalanced parentheses
      expect(automaton.run('(').successful).toBe(false);
      expect(automaton.run(')').successful).toBe(false);
      expect(automaton.run('(()').successful).toBe(false);
      expect(automaton.run('())').successful).toBe(false);
    });
  });

  describe('Language a^n b^n using Parser', () => {
    test('should create a^n b^n PDA from text definition', () => {
      const definition = `
        # Language: L = {a^n b^n | n >= 1}
        States: q0, q1, q2
        Input Alphabet: a, b
        Stack Alphabet: $, Z
        Start State: q0
        Final States: q2
        Initial Stack Symbol: $
        
        # Push Z for each 'a'
        δ(q0, a, $) = (q0, Z$)
        δ(q0, a, Z) = (q0, ZZ)
        
        # Transition to reading b's
        δ(q0, b, Z) = (q1, ε)
        
        # Pop Z for each 'b'
        δ(q1, b, Z) = (q1, ε)
        
        # Accept when all Z's are popped
        δ(q1, ε, $) = (q2, $)
      `;

      const automaton = PDAParser.parse(definition);

      // Test valid strings
      expect(automaton.run('ab').successful).toBe(true);
      expect(automaton.run('aabb').successful).toBe(true);
      expect(automaton.run('aaabbb').successful).toBe(true);
      expect(automaton.run('aaaabbbb').successful).toBe(true);

      // Test invalid strings
      expect(automaton.run('a').successful).toBe(false);
      expect(automaton.run('b').successful).toBe(false);
      expect(automaton.run('aab').successful).toBe(false);
      expect(automaton.run('abb').successful).toBe(false);
      expect(automaton.run('abab').successful).toBe(false);
      expect(automaton.run('').successful).toBe(false);
    });
  });

  describe('Static Factory Methods on PushdownAutomaton', () => {
    test('should create PDA using fromDefinition static method', () => {
      const definition = `
        States: q0, q1
        Start State: q0
        Final States: q1
        Initial Stack Symbol: $
        δ(q0, a, $) = (q1, ε)
      `;

      const automaton = PushdownAutomaton.fromDefinition(definition);
      expect(automaton).toBeInstanceOf(PushdownAutomaton);
      expect(automaton.run('a').successful).toBe(true);
      expect(automaton.run('b').successful).toBe(false);
    });

    test('should create PDA using fromSimpleConfig static method', () => {
      const config = {
        states: ['q0', 'q1'],
        startState: 'q0',
        finalStates: ['q1'],
        transitions: [
          { from: 'q0', input: 'a', stackPop: '$', to: 'q1', stackPush: '' }
        ]
      };

      const automaton = PushdownAutomaton.fromSimpleConfig(config);
      expect(automaton).toBeInstanceOf(PushdownAutomaton);
      expect(automaton.run('a').successful).toBe(true);
      expect(automaton.run('b').successful).toBe(false);
    });
  });

  describe('Complex PDA Examples', () => {
    test('should handle palindromes over {a,b}', () => {
      const definition = `
        # Palindromes with center marker 'c'
        # Language: L = {wcw^R | w ∈ {a,b}*}
        States: q0, q1, q2
        Input Alphabet: a, b, c
        Stack Alphabet: $, A, B
        Start State: q0
        Final States: q2
        Initial Stack Symbol: $
        
        # Push symbols onto stack
        δ(q0, a, $) = (q0, A$)
        δ(q0, a, A) = (q0, AA)
        δ(q0, a, B) = (q0, AB)
        δ(q0, b, $) = (q0, B$)
        δ(q0, b, A) = (q0, BA)
        δ(q0, b, B) = (q0, BB)
        
        # Read center marker
        δ(q0, c, $) = (q1, $)
        δ(q0, c, A) = (q1, A)
        δ(q0, c, B) = (q1, B)
        
        # Pop matching symbols
        δ(q1, a, A) = (q1, ε)
        δ(q1, b, B) = (q1, ε)
        
        # Accept when stack is empty
        δ(q1, ε, $) = (q2, $)
      `;

      const automaton = PDAParser.parse(definition);

      // Test valid palindromes
      expect(automaton.run('c').successful).toBe(true);
      expect(automaton.run('aca').successful).toBe(true);
      expect(automaton.run('bcb').successful).toBe(true);
      expect(automaton.run('abcba').successful).toBe(true);
      expect(automaton.run('aabcbaa').successful).toBe(true);

      // Test invalid strings
      expect(automaton.run('ab').successful).toBe(false);
      expect(automaton.run('abc').successful).toBe(false);
      expect(automaton.run('abcab').successful).toBe(false);
    });

    test('should handle nested structure language', () => {
      const definition = `
        # Language: L = {a^i b^j c^j d^i | i,j >= 1}
        States: q0, q1, q2, q3, q4
        Start State: q0
        Final States: q4
        Initial Stack Symbol: $
        
        # Count a's
        δ(q0, a, $) = (q0, A$)
        δ(q0, a, A) = (q0, AA)
        
        # Transition to b's
        δ(q0, b, A) = (q1, BA)
        
        # Count b's
        δ(q1, b, B) = (q1, BB)
        δ(q1, b, A) = (q1, BA)
        
        # Transition to c's
        δ(q1, c, B) = (q2, ε)
        
        # Match c's with b's
        δ(q2, c, B) = (q2, ε)
        
        # Transition to d's
        δ(q2, d, A) = (q3, ε)
        
        # Match d's with a's
        δ(q3, d, A) = (q3, ε)
        
        # Accept
        δ(q3, ε, $) = (q4, $)
      `;

      const automaton = PDAParser.parse(definition);

      // Test valid strings
      expect(automaton.run('abcd').successful).toBe(true);
      expect(automaton.run('aabbccdd').successful).toBe(true);
      expect(automaton.run('aaabbbcccdd').successful).toBe(false); // Wrong number of d's
      
      // Test invalid strings
      expect(automaton.run('abc').successful).toBe(false);
      expect(automaton.run('abdc').successful).toBe(false);
    });
  });
});