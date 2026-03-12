import { createSlice } from "@reduxjs/toolkit";

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    units: [],
  },
  reducers: {
    setUnits: (state, action) => {
      state.units = action.payload;
    },
  },
});

export const { setUnits } = unitSlice.actions;
export default unitSlice.reducer;