import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    clearAccessToken: (state) => {
      state.accessToken = null;
    },

    setInitialized: (state, action) => {
      state.initialized = action.payload;
    },
  },
});

export const { setAccessToken, clearAccessToken, setInitialized } =
  authSlice.actions;

export default authSlice.reducer;
