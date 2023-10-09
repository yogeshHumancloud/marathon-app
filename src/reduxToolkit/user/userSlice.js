import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: {
//     role: "user",
//     isEmailVerified: false,
//     activity: [],
//     events: [],
//     mobile_number: "9325834829",
//     id: "651d0ba951c73a512d49ac5b",
//   },
//   tokens: {
//     access: {
//       token:
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTFkMGJhOTUxYzczYTUxMmQ0OWFjNWIiLCJpYXQiOjE2OTY4MzA4NzQsImV4cCI6MTY5NjkxNzI3NCwidHlwZSI6ImFjY2VzcyJ9.ozzCIb8DtSxAuFV6dWw8a_lJv8U6dfuWGbsUUjE0u00",
//       expires: "2023-10-10T05:54:34.586Z",
//     },
//     refresh: {
//       token:
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTFkMGJhOTUxYzczYTUxMmQ0OWFjNWIiLCJpYXQiOjE2OTY4MzA4NzQsImV4cCI6MTY5OTQyMjg3NCwidHlwZSI6InJlZnJlc2gifQ.AFjsYEUTMdXPIiJkTA4w4CkENfV2ouOSBGNCF8r2yxk",
//       expires: "2023-11-08T05:54:34.587Z",
//     },
//   },
// };

const initialState = { user: null };

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
