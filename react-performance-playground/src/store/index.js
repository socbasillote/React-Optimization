import { configureStore } from "@reduxjs/toolkit";

import performanceReducer from "./performanceSlice";

export const store = configureStore({
  reducer: {
    performance: performanceReducer,
  },
});
