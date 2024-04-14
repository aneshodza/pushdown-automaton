// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Stack {
  stackValues: Array<string> = [];

  constructor() {
    this.stackValues = ["$"];
  }

  checkForValue(value: string) {
    return this.last() === value;
  }

  pop() {
    return this.stackValues.pop();
  }

  push(value: string) {
    this.stackValues.push(value);
  }

  last(): string {
    return this.stackValues[this.stackValues.length - 1];
  }

  stackClone(): Array<string> {
    return [...this.stackValues];
  }
}

