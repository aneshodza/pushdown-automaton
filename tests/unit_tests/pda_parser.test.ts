import PDAParser from '../../src/PDAParser';
import PushdownAutomaton from '../../src/PushdownAutomaton';

describe('PDAParser', () => {
  describe('parse method', () => {
    test('should parse basic PDA definition', () => {
      const definition = `
        States: q0, q1, q2
        Input Alphabet: a, b
        Stack Alphabet: $, X
        Start State: q0
        Final States: q2
        Initial Stack Symbol: $
        δ(q0, a, $) = (q1, X$)
        δ(q1, b, X) = (q2, ε)
      `;

      const automaton = PDAParser.parse(definition);
      expect(automaton).toBeInstanceOf(PushdownAutomaton);
      expect(automaton.defaultStackTocken).toBe('$');
      expect(automaton.startState?.name).toBe('q0');
      expect(automaton.endStates.length).toBe(1);
      expect(automaton.endStates[0].name).toBe('q2');
    });

    test('should handle epsilon transitions correctly', () => {
      const definition = `
        States: q0, q1
        Start State: q0
        Final States: q1
        Initial Stack Symbol: $
        δ(q0, ε, $) = (q1, ε)
      `;

      const automaton = PDAParser.parse(definition);
      const result = automaton.run('');
      expect(result.successful).toBe(true);
    });

    test('should handle multiple stack symbols being pushed', () => {
      const definition = `
        States: q0, q1
        Start State: q0
        Final States: q1
        Initial Stack Symbol: $
        δ(q0, a, $) = (q1, XY$)
      `;

      const automaton = PDAParser.parse(definition);
      expect(automaton.startState?.transitionFunctions[0].stackPush).toEqual(['$', 'Y', 'X']);
    });

    test('should handle comments and empty lines', () => {
      const definition = `
        # This is a comment
        States: q0, q1
        
        # Another comment
        Start State: q0
        Final States: q1
        Initial Stack Symbol: $
        
        # Transition comment
        δ(q0, a, $) = (q1, ε)
      `;

      const automaton = PDAParser.parse(definition);
      expect(automaton.startState?.name).toBe('q0');
    });

    test('should throw error for missing required fields', () => {
      const definition = `
        States: q0, q1
        # Missing start state and other required fields
      `;

      expect(() => PDAParser.parse(definition)).toThrow('Missing required PDA definition fields');
    });

    test('should throw error for invalid state references', () => {
      const definition = `
        States: q0, q1
        Start State: q0
        Final States: q2
        Initial Stack Symbol: $
        δ(q0, a, $) = (q1, ε)
      `;

      expect(() => PDAParser.parse(definition)).toThrow("Final state 'q2' not found in states list");
    });

    test('should handle delta notation variant', () => {
      const definition = `
        States: q0, q1
        Start State: q0
        Final States: q1
        Initial Stack Symbol: $
        delta(q0, a, $) = (q1, ε)
      `;

      const automaton = PDAParser.parse(definition);
      expect(automaton.startState?.transitionFunctions.length).toBe(1);
    });
  });

  describe('fromSimpleConfig method', () => {
    test('should create automaton from simple config', () => {
      const config = {
        states: ['q0', 'q1', 'q2'],
        startState: 'q0',
        finalStates: ['q2'],
        transitions: [
          { from: 'q0', input: 'a', stackPop: '$', to: 'q1', stackPush: 'X$' },
          { from: 'q1', input: 'b', stackPop: 'X', to: 'q2', stackPush: '' }
        ]
      };

      const automaton = PDAParser.fromSimpleConfig(config);
      expect(automaton.startState?.name).toBe('q0');
      expect(automaton.endStates.length).toBe(1);
      expect(automaton.endStates[0].name).toBe('q2');
    });

    test('should handle array stackPush in simple config', () => {
      const config = {
        states: ['q0', 'q1'],
        startState: 'q0',
        finalStates: ['q1'],
        transitions: [
          { from: 'q0', input: 'a', stackPop: '$', to: 'q1', stackPush: ['X', 'Y'] }
        ]
      };

      const automaton = PDAParser.fromSimpleConfig(config);
      expect(automaton.startState?.transitionFunctions[0].stackPush).toEqual(['X', 'Y']);
    });

    test('should use default initial stack symbol', () => {
      const config = {
        states: ['q0', 'q1'],
        startState: 'q0',
        finalStates: ['q1'],
        transitions: []
      };

      const automaton = PDAParser.fromSimpleConfig(config);
      expect(automaton.defaultStackTocken).toBe('$');
    });

    test('should use custom initial stack symbol', () => {
      const config = {
        states: ['q0', 'q1'],
        startState: 'q0',
        finalStates: ['q1'],
        initialStackSymbol: '#',
        transitions: []
      };

      const automaton = PDAParser.fromSimpleConfig(config);
      expect(automaton.defaultStackTocken).toBe('#');
    });

    test('should throw error for invalid state in simple config', () => {
      const config = {
        states: ['q0', 'q1'],
        startState: 'q2', // Invalid state
        finalStates: ['q1'],
        transitions: []
      };

      expect(() => PDAParser.fromSimpleConfig(config)).toThrow("Start state 'q2' not found");
    });
  });

  describe('transition parsing', () => {
    test('should parse various transition formats', () => {
      const definition = `
        States: q0, q1, q2, q3
        Start State: q0
        Final States: q3
        Initial Stack Symbol: $
        δ(q0, a, $) = (q1, X$)
        δ( q1 , b , X ) = ( q2 , ε )
        δ(q2,ε,$) = (q3,ε)
      `;

      const automaton = PDAParser.parse(definition);
      expect(automaton.startState?.transitionFunctions.length).toBe(1);
      
      const q1State = automaton.startState?.transitionFunctions[0].nextState;
      expect(q1State?.transitionFunctions.length).toBe(1);
      
      const q2State = q1State?.transitionFunctions[0].nextState;
      expect(q2State?.transitionFunctions.length).toBe(1);
    });

    test('should handle epsilon in different formats', () => {
      const definition = `
        States: q0, q1, q2, q3
        Start State: q0
        Final States: q3
        Initial Stack Symbol: $
        δ(q0, ε, $) = (q1, ε)
        δ(q1, epsilon, $) = (q2, epsilon)
        δ(q2, , $) = (q3, )
      `;

      const automaton = PDAParser.parse(definition);
      
      // All transitions should have empty string as input
      expect(automaton.startState?.transitionFunctions[0].input).toBe('');
      
      const q1State = automaton.startState?.transitionFunctions[0].nextState;
      expect(q1State?.transitionFunctions[0].input).toBe('');
      
      const q2State = q1State?.transitionFunctions[0].nextState;
      expect(q2State?.transitionFunctions[0].input).toBe('');
    });
  });
});