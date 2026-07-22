import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasUnsavedForm: false,
  isSubmitted: false
};

const createReservationSubmitSlice = createSlice({
  name: "createReservation",
  initialState,
  reducers: {
    setHasUnsavedForm: (state, action) => {
      state.hasUnsavedForm = action.payload;
    },
    setIsSubmitted : (state, action) => {
      state.isSubmitted = action.payload
    }
  },
});

const createReservationReducer = createReservationSubmitSlice.reducer

export const { setHasUnsavedForm, setIsSubmitted } = createReservationSubmitSlice.actions;

export const createReservationSelector = (state) => state?.createReservation;

export default createReservationReducer ;