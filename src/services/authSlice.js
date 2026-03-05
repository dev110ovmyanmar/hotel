import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionId: null,
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.sessionId = action.payload.sessionId;
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    clearAuthData: (state) => {
      state.sessionId = null;
      state.user = null;
      state.role = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;