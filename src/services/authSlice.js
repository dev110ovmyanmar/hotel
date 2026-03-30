import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../utils";

const localPermissions = loadState("InitPermissions");

const initialState = {
  user: null,
  permissions: localPermissions,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.permissions = action.payload.permissions;
    },

    logout: () => {
      return {
        ...initialState,
      };
    },
  },
});

const authReducer = authSlice.reducer;

export const { setUserData, logout } = authSlice.actions;

export const authSelector = (state) => state?.auth;

export default authReducer;
