import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    role: "user",
    isEmailVerified: false,
    activity: [],
    events: [],
    mobile_number: "9325834829",
    id: "651d0ba951c73a512d49ac5b",
  },
  tokens: {
    access: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTFkMGJhOTUxYzczYTUxMmQ0OWFjNWIiLCJpYXQiOjE2OTY1ODQ0MDYsImV4cCI6MTY5NjY3MDgwNiwidHlwZSI6ImFjY2VzcyJ9.0gSqrlcgE7MKRVufsfIt92ISML893P_ti7AYRLQ_G80",
      expires: "2023-10-07T09:26:46.450Z",
    },
    refresh: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTFkMGJhOTUxYzczYTUxMmQ0OWFjNWIiLCJpYXQiOjE2OTY1ODQ0MDYsImV4cCI6MTY5OTE3NjQwNiwidHlwZSI6InJlZnJlc2gifQ.fuzGD34x84WkZcBN6ELl71f4qoSrnYoeN5HUI1oT7kA",
      expires: "2023-11-05T09:26:46.451Z",
    },
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    deleteUser: (state, action) => {
      state.user = null;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
