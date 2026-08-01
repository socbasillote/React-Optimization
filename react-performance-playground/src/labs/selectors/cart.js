export const selectCartTotal = memoize((cart) => {
  console.log("Calculating total...");

  return cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
});

export function memoize(fn) {
  let lastInput;
  let lastResult;

  return function (input) {
    if (input === lastInput) {
      return lastResult;
    }

    lastInput = input;
    lastResult = fn(input);

    return lastResult;
  };
}

/* 
import { createSelector } from "@reduxjs/toolkit";

const selectCart = (state) => state.cart;

export const selectCartTotal = createSelector(
  [selectCart],
  (cart) => {
    console.log("Calculating total...");

    return cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }
); */

/**
 * createSelector(state, callback)
 * state = state to calculate
 * callback - How do I derive the value
 */
