import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activity: {
    name: "Running",
    workout: null,
    currentLocation: {},
    routeTracker: [],
    distance: 0,
    currentElapse: 0,
    isRunning: true,
    startTime: new Date()?.toString(),
    elapsedStartTime: new Date()?.toString(),
    elapsedTime: [],
    totalTime: 0,
  },
};

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setActivity: (state, action) => {
      state.activity = action.payload;
    },
    startNewActivity: (state, action) => {
      state.activity = {
        ...state.activity,
        currentLocation: {},
        routeTracker: [],
        distance: 0,
        currentElapse: 0,
        isRunning: true,
        startTime: new Date()?.toString(),
        elapsedStartTime: new Date()?.toString(),
        elapsedTime: [],
        totalTime: 0,
      };
    },
    deleteActivity: (state, action) => {
      state.activity = {
        name: "Running",
        workout: null,
        currentLocation: {},
        routeTracker: [],
        distance: 0,
        currentElapse: 0,
        isRunning: true,
        startTime: new Date()?.toString(),
        elapsedStartTime: new Date()?.toString(),
        elapsedTime: [],
        totalTime: 0,
      };
    },
    setCurrentLocation: (state, action) => {
      state.activity.currentLocation = action.payload;
    },
    setRouteTracker: (state, action) => {
      if (
        Array.isArray(state.activity.routeTracker[state.activity.currentElapse])
      ) {
        state.activity.routeTracker[state.activity.currentElapse] = [
          ...state.activity.routeTracker[state.activity.currentElapse],
          action.payload,
        ];
      } else {
        state.activity.routeTracker[state.activity.currentElapse] = [];
        state.activity.routeTracker[state.activity.currentElapse] = [
          ...state.activity.routeTracker[state.activity.currentElapse],
          action.payload,
        ];
      }
    },
    setDistance: (state, action) => {
      state.activity.distance += action.payload;
    },
    setCurrentElapse: (state, action) => {
      state.activity.currentElapse += action.payload;
    },
    setIsRunning: (state, action) => {
      state.activity.isRunning = action.payload
        ? action.payload
        : !state.activity.isRunning;
    },
    setStartTime: (state, action) => {
      state.activity.startTime = action.payload;
    },
    setElapsedStartTime: (state, action) => {
      state.activity.elapsedStartTime = action.payload;
    },
    setElapsedTime: (state, action) => {
      state.activity.elapsedTime[state.activity.currentElapse] = action.payload;
    },
    setTotalTime: (state, action) => {
      state.activity.totalTime += action.payload;
    },
  },
});

export const {
  setActivity,
  deleteActivity,
  startNewActivity,
  setCurrentLocation,
  setRouteTracker,
  setDistance,
  setCurrentElapse,
  setIsRunning,
  setStartTime,
  setElapsedStartTime,
  setElapsedTime,
  setTotalTime,
} = activitySlice.actions;

export default activitySlice.reducer;
