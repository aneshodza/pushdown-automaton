/**
 * Represents a stack structure used in a pushdown automaton to manage its symbols.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Stack {
  stackValues: Array<string> = [];

  /**
   * Constructs a stack instance with an initial symbol.
   */
  constructor() {
    this.stackValues = ["$"];
  }

  /**
   * Checks if the top value of the stack is equal to the specified value.
   * @param {string} value - The value to check against the top of the stack.
   * @returns {boolean} True if the top of the stack is the value, false otherwise.
   */
  checkForValue(value: string): boolean {
    return this.last() === value;
  }

  /**
   * Removes the top element of the stack and returns it.
   * @returns {string} The element that was removed from the top of the stack.
   * @throws {Error} If the stack is empty.
   */
  pop(): string {
    if (this.stackValues.length === 0) {
      throw new Error("Stack is empty");
    }
    return this.stackValues.pop()!;
  }

  /**
   * Adds a new element to the top of the stack.
   * @param {string} value - The value to be pushed onto the stack.
   */
  push(value: string) {
    this.stackValues.push(value);
  }

  /**
   * Retrieves the top element of the stack without removing it.
   * @returns {string} The top element of the stack.
   * @throws {Error} If the stack is empty.
   */
  last(): string {
    if (this.stackValues.length === 0) {
      throw new Error("Stack is empty");
    }
    return this.stackValues[this.stackValues.length - 1];
  }

  /**
   * Creates a clone of the current stack.
   * @returns {Array<string>} A new array containing the same elements as the stack.
   */
  stackClone(): Array<string> {
    return [...this.stackValues];
  }
}

export default Stack;
