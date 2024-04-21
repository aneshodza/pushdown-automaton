/**
 * Defines the structure of a termination message from a run or step in a pushdown automaton.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface TerminationMessage {
  reason: string;
  successful: boolean;
  code: number;
}

export default TerminationMessage;
