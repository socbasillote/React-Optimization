import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fps: 0,
  memory: "--",
  domNodes: 0,
};

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    setFPS(state, action) {
      state.fps = action.payload;
    },

    setMemory(state, action) {
      state.memory = action.payload;
    },

    setDomNodes(state, action) {
      state.domNodes = action.payload;
    },

    resetMetrics(state) {
      state.fps = 0;
      state.memory = "--";
      state.domNodes = 0;
    },
  },
});

export const {
  setFPS,
  incrementRenderCount,
  setMemory,
  setComponentCount,
  setDomNodes,
  resetMetrics,
} = performanceSlice.actions;

export default performanceSlice.reducer;
