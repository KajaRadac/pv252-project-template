import { factorial } from "./factorial.ts";

test("factorial-5", () => {
  expect(factorial(5)).toBe(120);
});

test("factorial-0", () => {
  expect(factorial(0)).toBe(1);
});

test("factorial-floating-point", () => {
  function will_throw() {
    factorial(0.5);
  }
  expect(will_throw).toThrow("Negative numbers not supported");
});

test("factorial-minus", () => {
  function will_throw() {
    factorial(-1);
  }
  expect(will_throw).toThrow("Negative numbers not supported");
});
