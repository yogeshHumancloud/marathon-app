import { createSlice } from "@reduxjs/toolkit";

const initialState = { marathon: null };

export const marathonSlice = createSlice({
  name: "marathon",
  initialState,
  reducers: {
    setMarathon: (state, action) => {
      state.marathon = action.payload;
    },
    deleteMarathon: (state, action) => {
      state.marathon = null;
    },
  },
});

export const { setMarathon, deleteMarathon } = marathonSlice.actions;

export default marathonSlice.reducer;
