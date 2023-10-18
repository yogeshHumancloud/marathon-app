import { createSlice } from "@reduxjs/toolkit";

const initialState = { activity: { name: "Running", workout: null } };

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setActivity: (state, action) => {
      state.activity = action.payload;
    },
    deleteActivity: (state, action) => {
      state.activity = null;
    },
  },
});

export const { setActivity, deleteActivity } = activitySlice.actions;

export default activitySlice.reducer;
