import PushdownAutomaton from './PushdownAutomaton';
import State from './State';
import TransitionFunction from './TransitionFunction';

/**
 * Interface representing a parsed transition function
 */
interface ParsedTransition {
  fromState: string;
  input: string;
  stackPop: string;
  toState: string;
  stackPush: string[];
}

/**
 * Interface representing a complete PDA definition
 */
interface PDADefinition {
  states: string[];
  inputAlphabet: string[];
  stackAlphabet: string[];
  startState: string;
  finalStates: string[];
  initialStackSymbol: string;
  transitions: ParsedTransition[];
}

/**
 * Parser for creating pushdown automata from text-based mathematical notation
 */
class PDAParser {
  /**
   * Parses a text-based PDA definition and returns a configured PushdownAutomaton
   * @param {string} definition - The text definition of the PDA
   * @returns {PushdownAutomaton} A fully configured PushdownAutomaton instance
   */
  static parse(definition: string): PushdownAutomaton {
    const parsed = this.parseDefinition(definition);
    return this.buildAutomaton(parsed);
  }

  /**
   * Parses the text definition into a structured PDADefinition object
   * @param {string} definition - The text definition
   * @returns {PDADefinition} Parsed PDA definition
   */
  private static parseDefinition(definition: string): PDADefinition {
    const lines = definition
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#')); // Remove empty lines and comments

    const result: Partial<PDADefinition> = {
      transitions: []
    };

    for (const line of lines) {
      if (line.startsWith('States:')) {
        result.states = this.parseList(line, 'States:');
      } else if (line.startsWith('Input Alphabet:')) {
        result.inputAlphabet = this.parseList(line, 'Input Alphabet:');
      } else if (line.startsWith('Stack Alphabet:')) {
        result.stackAlphabet = this.parseList(line, 'Stack Alphabet:');
      } else if (line.startsWith('Start State:')) {
        result.startState = this.parseValue(line, 'Start State:');
      } else if (line.startsWith('Final States:')) {
        result.finalStates = this.parseList(line, 'Final States:');
      } else if (line.startsWith('Initial Stack Symbol:')) {
        result.initialStackSymbol = this.parseValue(line, 'Initial Stack Symbol:');
      } else if (line.includes('δ(') || line.includes('delta(')) {
        const transition = this.parseTransition(line);
        if (transition) {
          result.transitions!.push(transition);
        }
      }
    }

    // Validate required fields
    if (!result.states || !result.startState || !result.finalStates || !result.initialStackSymbol) {
      throw new Error('Missing required PDA definition fields');
    }

    return result as PDADefinition;
  }

  /**
   * Parses a comma-separated list from a line
   * @param {string} line - The line to parse
   * @param {string} prefix - The prefix to remove
   * @returns {string[]} Array of parsed values
   */
  private static parseList(line: string, prefix: string): string[] {
    const content = line.substring(prefix.length).trim();
    return content.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }

  /**
   * Parses a single value from a line
   * @param {string} line - The line to parse
   * @param {string} prefix - The prefix to remove
   * @returns {string} The parsed value
   */
  private static parseValue(line: string, prefix: string): string {
    return line.substring(prefix.length).trim();
  }

  /**
   * Parses a transition function line
   * Expected formats:
   * δ(q0, a, $) = (q1, X$)
   * delta(q0, a, $) = (q1, X$)
   * δ(q0, ε, $) = (q1, ε)
   * @param {string} line - The transition line to parse
   * @returns {ParsedTransition | null} Parsed transition or null if invalid
   */
  private static parseTransition(line: string): ParsedTransition | null {
    // Match patterns like δ(q0, a, $) = (q1, X$) or delta(q0, a, $) = (q1, X$)
    const transitionRegex = /(?:δ|delta)\s*\(\s*([^,]+)\s*,\s*([^,]*)\s*,\s*([^)]+)\s*\)\s*=\s*\(\s*([^,]+)\s*,\s*([^)]*)\s*\)/;
    
    const match = line.match(transitionRegex);
    if (!match) {
      return null;
    }

    const [, fromState, input, stackPop, toState, stackPushStr] = match;

    // Handle epsilon transitions
    const normalizedInput = (input.trim() === 'ε' || input.trim() === 'epsilon' || input.trim() === '') ? '' : input.trim();
    
    // Parse stack push - can be empty (ε), single symbol, or multiple symbols
    let stackPush: string[] = [];
    const stackPushTrimmed = stackPushStr.trim();
    if (stackPushTrimmed !== 'ε' && stackPushTrimmed !== 'epsilon' && stackPushTrimmed !== '') {
      // Split into individual characters/symbols and reverse so rightmost is pushed last (top of stack)
      stackPush = stackPushTrimmed.split('').filter(char => char.trim() !== '').reverse();
    }

    return {
      fromState: fromState.trim(),
      input: normalizedInput,
      stackPop: stackPop.trim(),
      toState: toState.trim(),
      stackPush
    };
  }

  /**
   * Builds a PushdownAutomaton from a parsed definition
   * @param {PDADefinition} definition - The parsed PDA definition
   * @returns {PushdownAutomaton} Configured PushdownAutomaton instance
   */
  private static buildAutomaton(definition: PDADefinition): PushdownAutomaton {
    // Create automaton with initial stack symbol
    const automaton = new PushdownAutomaton(undefined, definition.initialStackSymbol);

    // Create all states
    const stateMap = new Map<string, State>();
    for (const stateName of definition.states) {
      const state = new State(stateName);
      stateMap.set(stateName, state);
    }

    // Set start state
    const startState = stateMap.get(definition.startState);
    if (!startState) {
      throw new Error(`Start state '${definition.startState}' not found in states list`);
    }
    automaton.setStartSate(startState);

    // Set final states
    for (const finalStateName of definition.finalStates) {
      const finalState = stateMap.get(finalStateName);
      if (!finalState) {
        throw new Error(`Final state '${finalStateName}' not found in states list`);
      }
      automaton.addEndState(finalState);
    }

    // Add transitions
    for (const transition of definition.transitions) {
      const fromState = stateMap.get(transition.fromState);
      const toState = stateMap.get(transition.toState);

      if (!fromState) {
        throw new Error(`Source state '${transition.fromState}' not found in states list`);
      }
      if (!toState) {
        throw new Error(`Target state '${transition.toState}' not found in states list`);
      }

      const transitionFunction = new TransitionFunction(
        transition.input,
        toState,
        transition.stackPop,
        transition.stackPush
      );

      fromState.addTransitionFunction(transitionFunction);
    }

    return automaton;
  }

  /**
   * Creates a simple PDA definition from a more concise format
   * Useful for quick prototyping and simple cases
   * @param {object} config - Simple configuration object
   * @returns {PushdownAutomaton} Configured PushdownAutomaton instance
   */
  static fromSimpleConfig(config: {
    states: string[],
    startState: string,
    finalStates: string[],
    initialStackSymbol?: string,
    transitions: {
      from: string,
      input: string,
      stackPop: string,
      to: string,
      stackPush: string | string[]
    }[]
  }): PushdownAutomaton {
    const initialStackSymbol = config.initialStackSymbol || '$';
    const automaton = new PushdownAutomaton(undefined, initialStackSymbol);

    // Create states
    const stateMap = new Map<string, State>();
    for (const stateName of config.states) {
      stateMap.set(stateName, new State(stateName));
    }

    // Set start state
    const startState = stateMap.get(config.startState);
    if (!startState) {
      throw new Error(`Start state '${config.startState}' not found`);
    }
    automaton.setStartSate(startState);

    // Set final states
    for (const finalStateName of config.finalStates) {
      const finalState = stateMap.get(finalStateName);
      if (!finalState) {
        throw new Error(`Final state '${finalStateName}' not found`);
      }
      automaton.addEndState(finalState);
    }

    // Add transitions
    for (const transition of config.transitions) {
      const fromState = stateMap.get(transition.from);
      const toState = stateMap.get(transition.to);

      if (!fromState || !toState) {
        throw new Error(`Invalid transition: ${transition.from} -> ${transition.to}`);
      }

      const stackPush = Array.isArray(transition.stackPush) 
        ? transition.stackPush 
        : transition.stackPush.split('').filter(c => c.trim() !== '');

      const transitionFunction = new TransitionFunction(
        transition.input,
        toState,
        transition.stackPop,
        stackPush
      );

      fromState.addTransitionFunction(transitionFunction);
    }

    return automaton;
  }
}

export default PDAParser;