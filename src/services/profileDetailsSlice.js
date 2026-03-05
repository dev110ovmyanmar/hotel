import { createSlice } from '@reduxjs/toolkit';
import { isServer } from '../utils/Utils';

const initialState = {
  adminProfileDetails: null
};

const adminProfileSlice = createSlice({
  name: 'adminProfile',
  initialState,
  reducers: {
    saveProfileDetails: (state, action) => {
        console.log(action.payload,"ActionPayload");
      state.adminProfileDetails = action.payload;
    },
  },
});

const adminProfileReducer = adminProfileSlice.reducer;

export const adminProfileSelector = (state) => state?.adminProfile;

export const { saveProfileDetails } = adminProfileSlice.actions;

export default adminProfileReducer;
