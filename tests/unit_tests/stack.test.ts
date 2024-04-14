import Stack from "../../src/Stack";

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test("Initializes the stack with a $", () => {
  expect(stack.stackValues).toEqual(["$"]);
});

test("Pushes a value onto the stack", () => {
  stack.push("a");
  expect(stack.stackValues).toEqual(["$", "a"]);
});

test("Pops a value off the stack", () => {
  stack.pop();
  expect(stack.stackValues).toEqual([]);
});

test("Pop returns the popped value", () => {
  expect(stack.pop()).toEqual("$");
})

test("Pop on empty stack throws", () => {
  stack.pop();
  expect(() => stack.pop()).toThrow();
});

test("Returns the last value of the stack", () => {
  stack.push("b");
  expect(stack.last()).toBe("b");
});

test("Checks if the last value matches the stack", () => {
  expect(stack.checkForValue("$")).toBeTruthy();
});

test("Creates a stack clone that doesn't allow mutation", () => {
  const stackClone = stack.stackClone();
  stackClone.push("d");
  expect(stackClone).not.toEqual(stack.stackValues);
});
